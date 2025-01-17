// app/actions/saveContact.ts
"use server";
import {auth} from "@auth";
import { parseServerActionRepsonse } from "@lib/utils";
import connection from '@config/db';
import { RowDataPacket } from 'mysql2/promise';
import { createClient } from '@supabase/supabase-js'
import { OpenAI } from 'openai';

const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_KEY = process.env.SUPABASE_KEY || '';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const OPENAI_API_KEY = process.env.OPENAI_API_KEY || '';

const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

type RekognitionMedia = {
    id: number;
    media_id: string;
  };

type VisionTagsRow = {
    vision_tags: string;
};

async function updateFaceName(faceId: number, name: string) {
    /*
    This function updates the MySQL rekognition table with the new face name.
    Finding the temp face name of the one used to identify and update all matching faces with the new name.
    */
    const conn = await connection.getConnection();
    try {
      const query = `
            UPDATE rekognition r
            JOIN (SELECT face_name FROM rekognition WHERE id = ?) AS sub
            ON r.face_name = sub.face_name
            SET r.face_name = ?;
          `;
      
      await conn.query(query, [faceId, name]);
      return { success: true, message: "Face name updated successfully!" };
    } catch (error) {
        return { success: false, message: "Error updating face name", error };
    } finally {
      conn.release();
    }
}

async function createContact(firstName:string, lastName:string, pictureId:number) {

    const email = `${await generateRndString()}@noemailprovided.com`;

    const session = await auth(); // Change to dynamically fetch from your auth system
    if (!session) return parseServerActionRepsonse({error: "Not authenticated", status: 401})  

    const currentUserId = session.user?.userId;

    const conn = await connection.getConnection();
    try {
      const query = `
            INSERT INTO contact (user_id, first_name, last_name, email, picture)
            SELECT ?, ?, ?, ?, r.image_path
            FROM rekognition r
            WHERE r.id = ?;
          `;
      
      await conn.query(query, [currentUserId, firstName, lastName, email, pictureId]);
      return { success: true, message: "Contact created successfully!" };
    } catch (error) {
        return { success: false, message: "Error creating contact", error };
    } finally {
      conn.release();
    }  
}

async function updateEmbedding(faceId: number, name: string) {
    /* This function will pull all the entries matching the faceId & the vision_tags from supabase, update the string, create a new embedding with openAI and update the
    entry in supabase with the new vlalues */

    const conn = await connection.getConnection();

    // get all the media_ids for the faceId in rekognition
    const [mediaIds] =  await conn.query<RekognitionMedia[] & RowDataPacket[]>('SELECT id, media_id FROM rekognition WHERE matching_face_id = (SELECT matching_face_id FROM rekognition WHERE id=?)', [faceId]);

    mediaIds.forEach(async (media) => {

        //Step 1 pull the vision_tags from supabase
        const {data, error} = await supabase
            .from('google_photos')
            .select('vision_tags')
            .eq('media_id', media.media_id);

        if (error) {
            console.error('Error fetching vision_tags:', error.message);
            return;
        }

        data.forEach(async (row: VisionTagsRow) => {

            console.log(`Updating vision_tags for media_id: ${media.media_id}`);

            // Step 2 modify the vision_tags with the new name
            const visionTagObject = JSON.stringify(row.vision_tags)
            const visionTag = JSON.parse(visionTagObject);

            if(!visionTag.people) {
                // if there are no people in the vision_tags, add the new name
                visionTag.people = [name];
            } else if (Array.isArray(visionTag.people)) {
                // if there are people in the vision_tags, check if the new name is already in the list and add it if not
                if (!visionTag.people.includes(name)) {
                    visionTag.people.push(name);
                }
            } else {
                // if there is a single person in the vision_tags, create a new array with the new name and the existing name
                visionTag.people = [visionTag.people, name];
            }

            const visionTagString = JSON.stringify(visionTag);

            console.log(`Updated vision_tags: ${visionTagString}`);

            // Step 3 create a new embedding with openAI
            const embeddingResponse = await openai.embeddings.create({
                model: "text-embedding-3-small",
                input: visionTagString,
                encoding_format: "float",
              });
              
            // Extract only the embedding vector
            const embeddingVector = embeddingResponse.data[0].embedding;

            // Step 4 update the entry in supabase with the new values
            const {error} = await supabase
                .from('google_photos')
                .update({ vision_tags: visionTag, embedding: embeddingVector})
                .eq('media_id', media.media_id);
            
            if (error) {
                console.error('Error updating vision_tags:', error.message);
                return;
            }
            
        });
    });
}

async function generateRndString() {
    return Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 10);
}

async function updateFaceAsIdentified(faceId: number) {
    const conn = await connection.getConnection();
    try {
        const query = `
            UPDATE rekognition
            SET identified = 1
            WHERE id = ?;
        `;

        await conn.query(query, [faceId]);
        return { success: true, message: "Face updated as identified successfully!" };
    } catch (error) {
        return { success: false, message: "Error updating face as identified", error };
    } finally {
        conn.release();
    }
}

async function deleteRekognitionEntries(faceId: number){
    const conn = await connection.getConnection();
    try {
        const query = `
            DELETE r
            FROM rekognition r
            JOIN (
                SELECT matching_face_id 
                FROM rekognition 
                WHERE id = ?
            ) AS sub
            ON r.matching_face_id = sub.matching_face_id
            WHERE r.id != ?;
        `;

        console.log(query);

        await conn.query(query, [faceId, faceId]);
        return { success: true, message: "Rekognition entries deleted successfully!" };
    } catch (error) {
        return { success: false, message: "Error deleting rekognition entries", error };
    } finally {
        conn.release();
    }
}

export async function saveContact(formData: FormData) {
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;

    //PictureId is the column "id" of the face in the rekognition table
    const pictureId = formData.get("pictureId") as string;

    const fullName = `${firstName} ${lastName}`;


    // Simulate saving to a database
    console.log("Saving contact:", { firstName, lastName, pictureId });

    const updatFaceName = await updateFaceName(parseInt(pictureId), fullName);
    if (!updatFaceName.success) {
        console.log("Error updating face name:", updatFaceName.error);
        return { success: false, message: "Error updating face name" };
    }

    const createCtc = await createContact(firstName, lastName, parseInt(pictureId));
    if (!createCtc.success) {
        console.log("Error creating contact:", createCtc.error);
        return { success: false, message: "Error creating contact" };
    }

    await updateEmbedding(parseInt(pictureId), fullName);

    const updateFace = await updateFaceAsIdentified(parseInt(pictureId));
    if (!updateFace.success) {
        console.log("Error updating face as identified:", updateFace.error);
        return { success: false, message: "Error updating face as identified" };
    }
    
    //Delete the entries in rekognition except the orignal face
    const deleteRekognition = await deleteRekognitionEntries(parseInt(pictureId));
    if (!deleteRekognition.success) {
        console.log("Error deleting rekognition entries:", deleteRekognition.error);
        return { success: false, message: "Error deleting rekognition entries" };
    }


    return { success: true, message: "Contact saved successfully!" };
}

export async function deleteFace(pictureId: number) {
    console.log("Deleting face with id:", pictureId);

    // TODO : Delete the image from the S3 bucket
    
    const conn = await connection.getConnection();
    try {
      const query = `
            DELETE FROM rekognition WHERE id = ?
          `;
      
      await conn.query(query, [pictureId]);
      return { success: true, message: "Face deleted successfully!" };
    } catch (error) {
        return { success: false, message: "Error deleting face from Rekognition", error };
    } finally {
      conn.release();
    }
}
