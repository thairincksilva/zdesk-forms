import axios from 'axios';
import config from './config/config.js';
import { getNewAccessToken } from './auth/auth.js'; 

export  async function getCustomer(customerId) {
  const accessToken = await getNewAccessToken(); 

  try {
    const response = await axios.get(`https://desk.zoho.com/api/v1/contacts/${customerId}`, {
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`,
        'orgId': config.orgId,
      },
    });

    return response.data
  } catch (error) {
    console.error('Erro ao buscar cliente:', error);
    throw new Error(error);
  }
}
