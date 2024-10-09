import dotenv from 'dotenv';
dotenv.config(); 

export default {
    clientId : process.env.ZOHO_CLIENT_ID,
    clientSecret : process.env.ZOHO_CLIENT_SECRET,
    refreshToken : process.env.ZOHO_REFRESH_TOKEN,
    orgId : process.env.ZOHO_ORG_ID,
}