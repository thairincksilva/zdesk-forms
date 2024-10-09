import axios from 'axios';
import config from './config/config.js';
import { getNewAccessToken } from './auth/auth.js';


export  async function createContact(req, res) {
  const { firstName, lastName, email } = req.body; 

  console.log('Dados recebidos:', { firstName, lastName, email });

  const accessToken = await getNewAccessToken(); 

  if (!accessToken) {
    res.status(500).json({ message: 'Erro ao obter access token' });
  }

  const contactData = {
    firstName: firstName,
    lastName: lastName,
    email: email
  };

  console.log('Enviando dados para Zoho:', contactData);

  try {
    const response = await axios.post('https://desk.zoho.com/api/v1/contacts',JSON.stringify(contactData), {
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`,
        'orgId': config.orgId
      },
    });

    const result = response.data;

    console.log('Resposta da Zoho:', result);

    res.status(200).json(result); 
  } catch (error) {
    res.status(500).json({ message: 'Erro ao fazer a requisição', error });
  }
};
