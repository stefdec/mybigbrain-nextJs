"user server";
import connection from '@config/db';

export const registerUser = async (formData: FormData) => {
    const firstName = formData.get('firstName');
    const lastName = formData.get('lastName');
    const email = formData.get('email');
    const password = formData.get('password');

    const conn = await connection.getConnection();

};