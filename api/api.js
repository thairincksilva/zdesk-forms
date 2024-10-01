import fetch from 'node-fetch';
import { getNewAccessToken } from './auth/auth.js';

const orgId = '861735330';

export async function createZohoTicket(ticketData) {
  const accessToken = await getNewAccessToken();

  if (!accessToken) {
    console.error('Falha ao obter access token, não é possível criar o ticket.');
    return;
  }

  const apiUrl = 'https://desk.zoho.com/api/v1/tickets';

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`,
        'Content-Type': 'application/json',
        'orgId': orgId
      },
      body: JSON.stringify(ticketData)
    });

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
