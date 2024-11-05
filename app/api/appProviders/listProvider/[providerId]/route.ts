import { NextResponse } from 'next/server';
import connection from '@config/db';

export async function GET(req: Request, context: { params: Promise<{ providerId: number }> }) {
  const conn = await connection.getConnection();
  const providerId = await (await context.params).providerId;

  // Placeholder for current user ID (replace this with actual user ID from session/auth)
  const currentUserId = 2; // Change to dynamically fetch from your auth system
  

  try {
    // Step 1: Get all providers with id and name
    const [providers]: [any[], any] = await conn.query('SELECT id as provider_id, name as provider_name, logo as provider_logo FROM provider WHERE id = ?', [providerId]);

    // Step 2: For each provider, fetch related processes and check user-process link for each process
    const providersData = await Promise.all(
      providers.map(async (provider) => {
        // Fetch processes linked to the current provider
        const [processes]: [any[], any] = await conn.query(
          'SELECT id as process_id, name as process_name, description as process_description, logo as process_logo FROM process WHERE provider_id = ?',
          [provider.provider_id]
        );

        // For each process, check if the current user has a link in `user_process`
        const processesWithUserLink = await Promise.all(
          processes.map(async (process) => {
            const [userProcessLink]: [any[], any] = await conn.query(
              'SELECT EXISTS(SELECT 1 FROM user_process WHERE user_id = ? AND process_id = ?) AS is_linked',
              [currentUserId, process.process_id]
            );

            return {
              ...process,
              is_user_linked: userProcessLink[0]?.is_linked === 1, // true if link exists, false otherwise
            };
          })
        );

        return {
          ...provider,
          processes: processesWithUserLink,
        };
      })
    );

    return NextResponse.json(providersData);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Database query error' }, { status: 500 });
  } finally {
    conn.release();
  }
}