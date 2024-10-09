import axios from 'axios';
import { getNewAccessToken } from './auth/auth.js';
import config from './config/config.js';

export async function createTicket(req, res) {
  const accessToken = await getNewAccessToken(); 

  if (!accessToken) {
    res.status(500).json({ message: 'Erro ao obter access token' });
    return;
  }

  const ticketData = req.body;

  console.log('Ticket data a ser enviado:', ticketData); 

  try {
    const response = await axios.post('https://desk.zoho.com/api/v1/tickets', JSON.stringify(ticketData),{
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`,
        'orgId': config.orgId
      }
    });

    const result = response.data;

    console.log('Resposta da API Zoho Desk:', result);

    res.status(200).json(result)
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao fazer a requisição', error});
  }
};

