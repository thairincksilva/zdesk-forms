import axios from 'axios';
import { getNewAccessToken } from './auth/auth.js';
import config from './config/config.js';

export  async function getContactByEmail(req, res) {
  const email = req.query.email;

  console.log(`Recebendo requisição para buscar contato com email: ${email}`);

  const accessToken = await getNewAccessToken(); 

  if (!accessToken) {
    console.error('Erro ao obter access token.');
    res.status(500).json({ message: 'Erro ao obter access token' });
    return;
  }

  console.log('Access token obtido com sucesso.');

  try {
    console.log(`Buscando contato com email ${email} na API Zoho Desk...`);
    const response = await axios.get(`https://desk.zoho.com/api/v1/contacts/search?email=${email}`, {
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`,
        'orgId': config.orgId,
      },
    });

    const data = response.data.data

    res.status(200).json(data[0]); 
  } catch (error) {
    console.error('Erro ao buscar contato:', error);
    res.status(500).json({ message: 'Erro ao buscar contato', error: error.message });
  }
}
