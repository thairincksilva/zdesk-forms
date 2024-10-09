import axios from 'axios';
import config from '../config/config.js';

export async function getNewAccessToken() {
  try {
    const response = await axios.post('https://accounts.zoho.com/oauth/v2/token',
      new URLSearchParams({
      client_id: config.clientId,
      client_secret: config.clientSecret,
      grant_type: 'refresh_token',
      refresh_token: config.refreshToken
    }));

    const data = response.data;
    
    return data.access_token
  } catch (error) {
    console.log(error.res)
    throw new Error('Erro ao fazer autenticação');
  }
}
