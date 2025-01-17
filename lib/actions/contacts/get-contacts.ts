"user server"
import {auth} from "@auth";
import { parseServerActionRepsonse } from "@lib/utils";
import { NextResponse } from 'next/server';
import connection from '@config/db';
import { RowDataPacket } from 'mysql2/promise';
import { Contact } from '@/types/types';

export const getContacts = async () => {
    const conn = await connection.getConnection();
    const session = await auth();
    if (!session) return parseServerActionRepsonse({error: "Not authenticated", status: 401})
    
    const currentUserId = session.user?.userId;

    console.log('currentUserId:', currentUserId);

    const query = `
        SELECT id, first_name, last_name, dob, email, phone, address, address2, city, state, postcode, country, relationship_id, CONCAT(? , picture) as picture
        FROM contact
        WHERE user_id = ?;
    `;

    try {
        const [contacts] =  await conn.query<Contact[] & RowDataPacket[]>(query, [`https://${process.env.AWS_PHOTO_BUCKET_URL}/`, currentUserId]);

        return NextResponse.json({ 
            contacts, 
            bucketUrl: process.env.AWS_PHOTO_BUCKET_URL 
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Database query error' }, { status: 500 });
    } finally {
        conn.release();
    }
}

