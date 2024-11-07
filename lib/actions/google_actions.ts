import connection from '@config/db';
import { ResultSetHeader } from 'mysql2/promise';
import { RowDataPacket } from 'mysql2/promise';
import qs from 'qs';

type Process = {
    id: number;
    name: string;
    api_url: string;
};


async function _getGoogleUserInfo(accessToken:string) {
    try {
        // Make a GET request to the Google userinfo endpoint
        const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        // Extract the Google user ID (sub) from the response
        const { sub, email } = await response.json();

        return { userId: sub, email };
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error('Error fetching user profile:', error.message);
        } else {
            console.error('Error fetching user profile:', error);
        }
        throw error;
    }
}

export const saveAndPullGoogle = async (userId:string, providerId:string, scopes:string[], accessToken:string, refreshToken:string) => {
    const conn = await connection.getConnection();
    const pythonApiUrl = process.env.PYTHON_API_URL;
    const { default: pLimit } = await import('p-limit');

    const { userId: sub, email } = await _getGoogleUserInfo(accessToken);
    const userEmail = email;
    const googleUserId = sub;

    // Set a concurrency limit for the pull
    const limit = pLimit(1);

    // const queryDelete = `
    //     DELETE user_process
    //     FROM user_process
    //     INNER JOIN process ON user_process.process_id = process.id
    //     WHERE user_process.user_id = ? AND process.provider_id = ?;
    // `;

    // try {
    //     const [result] = await conn.query<ResultSetHeader>(queryDelete, [userId, providerId]);
    //     console.log(`${result.affectedRows} row(s) deleted.`);
    // } catch (error) {
    //     console.error('Error occurred while deleting user processes for the specified provider:', error);
    // }

    try {
        const tasks = scopes.map(scope => limit(async () => {
            if (scope !== "https://www.googleapis.com/auth/userinfo.email") {
                try {
                    let query = `SELECT id, name, api_url FROM process WHERE scope = ?`;
                    const [rows] = await connection.query<Process[] & RowDataPacket[]>(query, [scope]);

                    const { id, api_url } = rows[0];
                    const processId = id;

                    query = `
                        INSERT INTO user_process (user_id, process_id, registered)
                        VALUES (?, ?, ?)
                        ON DUPLICATE KEY UPDATE
                            registered = 1
                        `;
                        try {
                            const [result] = await conn.query<ResultSetHeader>(query, [userId, processId, 1]);
                            console.log(`${result.affectedRows} row(s) affected.`);
                        } catch (error) {
                            console.error('Error during insert operation:', error);
                        }

                    const inputData = {
                        google_user_access_token: accessToken,
                        google_user_refresh_token: refreshToken,
                        google_user_email: userEmail,
                        google_user_id: googleUserId,
                        node_user_id: userId,
                        provider_id: providerId,
                        process_id: processId
                    };

                    const formData = qs.stringify(inputData);

                    await fetch(`${pythonApiUrl}${api_url}`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                            mAuth: `Bearer ${process.env.PYTHON_AUTH_TOKEN}`
                        },
                        body: formData
                    });

                } catch (error) {
                    console.error('Error saving scope:', error);
                }
            }
        }));

        // Execute all tasks
        await Promise.all(tasks);
    } catch (error) {
        console.error('Error executing tasks:', error);
    } finally {
        conn.release();
    }  
}