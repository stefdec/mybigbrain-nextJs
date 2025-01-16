"user server"
import {auth} from "@auth";
import { parseServerActionRepsonse } from "@lib/utils";
import { NextResponse } from 'next/server';
import connection from '@config/db';
import { RowDataPacket } from 'mysql2/promise';


type Face = {
  id: number;
  media_id: string;
  image_path: string;
  numPhotos?: number;
};


export const getFaces = async () => {
  // Placeholder for current user ID (replace this with actual user ID from session/auth)
  const conn = await connection.getConnection();
  const session = await auth(); // Change to dynamically fetch from your auth system
  if (!session) return parseServerActionRepsonse({error: "Not authenticated", status: 401})

  const awsBucketUrl = `https://${process.env.AWS_PHOTO_BUCKET_URL}`;
  
  const currentUserId = session.user?.userId;


  try {
    const [faces] =  await conn.query<Face[] & RowDataPacket[]>('SELECT id, media_id, image_path FROM rekognition WHERE image_path IS NOT NULL AND user_id = ? AND identified=?', [currentUserId, 0]);
    const facesData = faces.map((face) => {
      return {
        id: face.id,
        media_id: face.media_id,
        image_path: `${awsBucketUrl}/${face.image_path}`
      }
    });

    const numberOfFaces = facesData.length;

    return NextResponse.json({
      faces: facesData,
      numPhotos: numberOfFaces,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Database query error' }, { status: 500 });
  } finally {
    conn.release();
  }
}