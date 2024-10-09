import { getNewAccessToken } from './auth/auth.js';
import axios from 'axios';


export async function createZohoTicket(ticketData) {
  const accessToken = await getNewAccessToken();

  if (!accessToken) {
    console.error('Falha ao obter access token, não é possível criar o ticket.');
    return;
  }

  const apiUrl = 'https://desk.zoho.com/api/v1/tickets';

  try {
    const response = await axios.post(apiUrl,JSON.stringify(ticketData),{
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`,
        'orgId': orgId
      }});

    const result = await response.json();

    if (response.ok) {
      console.log('Ticket criado com sucesso:', result);
    } else {
      console.error('Erro ao criar ticket:', result.message);
    }
  } catch (error) {
    console.error('Erro de conexão ao criar ticket:', error.message);
  }
}
