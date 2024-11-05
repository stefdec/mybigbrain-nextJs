import connection from '@config/db';
import qs from 'qs';

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
    } catch (error: any) {
        console.error('Error fetching user profile:', error.response ? error.response.data : error.message);
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

    //Delete the processes for the user for this provider
    const query_delete = `
        DELETE user_process
        FROM user_process
        JOIN process ON user_process.process_id = process.id
        WHERE user_process.user_id = ? AND process.provider_id = ?;
        `;

    try {
        const [row]: [any[], any] = await conn.query(query_delete, [userId, providerId]);
        //const [rows] = await db.execute(query_delete, [userId, providerId]);
        //console.log(`${rows.affectedRows} row(s) deleted.`);
    } catch (error) {
        console.error('Error deleting processes for the user:', error);
    }

    try {
        const tasks = scopes.map(scope => limit(async () => {
            if (scope !== "https://www.googleapis.com/auth/userinfo.email") {
                try {
                    let query = `SELECT id, name, api_url FROM process WHERE scope = ?`;
                    const [rows] : [any[], any] = await connection.query(query, [scope]);

                    const { id, name, api_url } = rows[0];
                    const processId = id;
                    const processName = name;



                    query = `
                        INSERT INTO user_process (user_id, process_id, registered)
                        VALUES (?, ?, ?)
                        ON DUPLICATE KEY UPDATE
                            registered = 1
                        `;
                    await conn.query(query, [userId, processId, 1]);

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

                    const response = await fetch(`${pythonApiUrl}${api_url}`, {
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