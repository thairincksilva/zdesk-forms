import fetch from 'node-fetch'; 
import { getNewAccessToken } from './createTicket.js'; // Usa o método de obtenção de access token

const orgId = '861735330'; 

export default async function getContactByEmail(req, res) {
  const email = req.query.email;

  const accessToken = await getNewAccessToken(); 
  if (!accessToken) {
    res.status(500).json({ message: 'Erro ao obter access token' });
    return;
  }

  try {
    const response = await fetch(`https://desk.zoho.com/api/v1/contacts/search?email=${email}`, {
      method: 'GET',
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`,
        'Content-Type': 'application/json',
        'orgId': orgId,
      },
    });

    const data = await response.json();
    if (response.ok && data.length > 0) {
      res.status(200).json(data); // Retorna os dados do contato encontrado
    } else {
      res.status(404).json({ message: 'Contato não encontrado', data });
    }
  } catch (error) {
    console.error('Erro ao buscar contato:', error);
    res.status(500).json({ message: 'Erro ao buscar contato', error });
  }
}
