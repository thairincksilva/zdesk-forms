import fetch from 'node-fetch';
import { getNewAccessToken } from '../auth/auth.js'; 

const orgId = '861735330'; 

export default async function getCustomer(customerId) {
  const accessToken = await getNewAccessToken(); 

  try {
    const response = await fetch(`https://desk.zoho.com/api/v1/contacts/${customerId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`,
        'orgId': orgId,
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const customerData = await response.json();
      return customerData;
    } else {
      throw new Error('Erro ao buscar cliente: ' + response.statusText);
    }
  } catch (error) {
    console.error('Erro ao buscar cliente:', error);
    throw error;
  }
}
