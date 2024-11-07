import crypto from 'crypto';


export const encryptToken = async (token:string) => {
    const AES_KEY_HEX = process.env.AES_SECRET_KEY;

    if (!AES_KEY_HEX || !token) return null;

    const AES_KEY = Buffer.from(AES_KEY_HEX, 'hex');

    if (AES_KEY.length !== 32) {
        throw new Error('Invalid AES key length. AES key must be 32 bytes for AES-256.');
    }

    const iv = crypto.randomBytes(16); // Initialization vector (16 bytes for AES)
    const cipher = crypto.createCipheriv('aes-256-cbc', AES_KEY, iv);

    let encrypted = cipher.update(token, 'utf-8', 'hex');
    encrypted += cipher.final('hex');

    // Return the IV and encrypted value concatenated for later decryption
    return `${iv.toString('hex')}:${encrypted}`;
}

// Function to decrypt a token using AES-256-CBC
export const decryptToken = async (encryptedToken: string) => {
    const AES_KEY_HEX = process.env.AES_SECRET_KEY;
  
    if (!encryptedToken || !AES_KEY_HEX) return null;
  
    // Convert the hex AES key to a Buffer
    const AES_KEY = Buffer.from(AES_KEY_HEX, 'hex');
  
    // Split the IV and the encrypted token
    const [ivHex, encrypted] = encryptedToken.split(':');
  
    // Convert hex IV to a Buffer
    const iv = Buffer.from(ivHex, 'hex');
  
    // Create a decipher instance
    const decipher = crypto.createDecipheriv('aes-256-cbc', AES_KEY, iv);
  
    // Decrypt the encrypted value
    let decrypted = decipher.update(encrypted, 'hex', 'utf-8');
    decrypted += decipher.final('utf-8');
  
    return decrypted;
  };