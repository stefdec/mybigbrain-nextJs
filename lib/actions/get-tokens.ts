
import crypto from 'crypto';

const encString = {
  "access_token": "04bc575b40f664c9b58171cbd293e92e:c76d2246b1ae4218c3bdad56c9e7b6f265b4a4f6cdda9343fa6f29fad92456943b98036a9f8280f39d9dd445952ed0ec160b1e6296a443b74d0ba4031fb2d095cf6c9ba9360c255133153a2cd9a3ef9374fc2e917dde269d4adf74767e6105465e231fef925c97a661e864c1f8561aed44c9631de8c28f0ae6e6e9595b03e3e732616b1f202d81dbd4992dadc7530f942757f0c478f348a8551d119277ed86242c7cabf9961f1cc3bdc6187636c667ec50c787ce32e25e8ad94cff7d63db8096b7905abbd112dd61c8d6956aef79c59d20a287bdac7662542336b4aa08551723",
  "refresh_token": "a8640641c0e00a4825834450795bb75d:694e4a9d002cd5f733f50b049b7061599dfd82471f1b1111f84cc4f9cd009e048ab3fe4c626a959e744f4558bd04b81761d2c51920e44202a1804ecc5cbc429e706ba2fe77a731d7ef8f82067acd9c5b282710d4f876e2a733cad370e96f56a81a12aea54f7d6621a83d02241359bd43"
}



  const decryptToken = async (encryptedToken: string) => {
    //A sauver dans le fichier .env
    const AES_KEY_HEX = "f0a148038718b513369ff2486c7e34191bbf9f97876621e19c17c59d128a91a8";
  
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

export const getTokens = async () => {  
    // Decrypt the tokens
    const accessToken = await decryptToken(encString.access_token);
    const refreshToken = await decryptToken(encString.refresh_token);

    console.log(`Access token: ${accessToken}`);
    console.log(`Refresh token: ${refreshToken}`);
  
    return { accessToken, refreshToken };
  };