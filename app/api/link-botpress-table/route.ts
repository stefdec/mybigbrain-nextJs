import { NextResponse } from "next/server";
import connection from '@config/db';

export async function POST(req: Request) {
    try {
        // Parse the request body to get the userEmail and tableId
        const { userId, userEmail, tableId } = await req.json();
        const authorizationHeader = req.headers.get('Authorization');

        const api_key = `Bearer ${process.env.BB_GFUNCTION_API_KEY}`;

        if (!authorizationHeader) {
            return NextResponse.json({ error: 'Authorization header is required' }, { status: 401 });
        }

        if (authorizationHeader !== api_key) {
            return NextResponse.json({ error: 'Invalid API key' }, { status: 401 });
        }
    
        // Validate the input parameters
        if (!userId || !userEmail || !tableId) {
            return new Response(JSON.stringify({ error: 'Missing data' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
            });
        }
    
        // Save the table ID to the database
        const success = await saveTableId(userId, userEmail, tableId);
        if (!success) {
            return new Response(JSON.stringify({ error: 'Error saving table ID' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
            });
        }
  
        // Assuming the operation is successful, return a response
        return new Response(JSON.stringify({ message: 'Request processed successfully', userId, userEmail, tableId }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
      // Handle any errors that occur during the request handling
      console.error('Error processing request:', error);
      return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }


const saveTableId = async (userId: string, userEmail: string, tableId: string): Promise<boolean> => {
    const conn = await connection.getConnection();
    try {
      const query = `
            INSERT INTO user_botpress_photo_table (user_id, user_email, botpress_table_id)
            VALUES (?, ?, ?)
            ON DUPLICATE KEY UPDATE botpress_table_id = VALUES(botpress_table_id)
          `;
      
      await conn.query(query, [userId, userEmail, tableId]);
      return true;
    } catch (error) {
        console.error('Error saving botpress table:', error);
        return false;
    } finally {
      conn.release();
    }
  }