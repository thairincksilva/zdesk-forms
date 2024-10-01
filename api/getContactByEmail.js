import fetch from 'node-fetch';
import { getNewAccessToken } from './createTicket.js'; // Usa o método de obtenção de access token

const orgId = '861735330'; 

export default async function getContactByEmail(req, res) {
  const email = req.query.email;

  console.log(`Recebendo requisição para buscar contato com email: ${email}`);

  // Obter novo access token
  const accessToken = await getNewAccessToken(); 
  if (!accessToken) {
    console.error('Erro ao obter access token.');
    res.status(500).json({ message: 'Erro ao obter access token' });
    return;
  }

  console.log('Access token obtido com sucesso.');

  try {
    // Fazer a requisição para buscar o contato pelo e-mail
    console.log(`Buscando contato com email ${email} na API Zoho Desk...`);
    const response = await fetch(`https://desk.zoho.com/api/v1/contacts/search?email=${email}`, {
      method: 'GET',
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`,
        'Content-Type': 'application/json',
        'orgId': orgId,
      },
    });

    const data = await response.json();

    // Log da resposta completa para fins de depuração
    console.log('Resposta da API Zoho Desk:', JSON.stringify(data, null, 2));

    // Verificar se a resposta foi bem-sucedida e se há contatos encontrados
    if (response.ok && data.data && data.data.length > 0) {
      console.log(`Contato encontrado: ${data.data[0].email}`);
      res.status(200).json(data.data[0]); // Retorna o primeiro contato encontrado
    } else {
      console.warn(`Contato não encontrado para o email: ${email}`);
      res.status(404).json({ message: 'Contato não encontrado', data });
    }
  } catch (error) {
    console.error('Erro ao buscar contato:', error);
    res.status(500).json({ message: 'Erro ao buscar contato', error: error.message });
  }
}
