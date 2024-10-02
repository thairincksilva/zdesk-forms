import fetch from 'node-fetch'; 
import FormData from 'form-data';

const clientId = '1000.KC7V3888M7W0M0BYHDFA6ORJV1082L';
const clientSecret = '6686ff0d6d0c7a0a56c46af8daf360cb3700c05852';
const refreshToken = '1000.f6d0ff0e4946d6c8a5bfc4548dba63c1.ac4ddfd4ccf09d513bb45ad7c0424b9f';
const orgId = '861735330'; 

export async function getNewAccessToken() {
  const tokenUrl = 'https://accounts.zoho.com/oauth/v2/token';
  const params = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    grant_type: 'refresh_token',
    refresh_token: refreshToken
  });

  try {
    const response = await fetch(tokenUrl, {
      method: 'POST',
      body: params
    });

    const data = await response.json();

    if (response.ok) {
      console.log('Novo access token obtido:', data.access_token);
      return data.access_token; 
    } else {
      throw new Error(`Erro ao renovar o access token: ${data.message}`);
    }
  } catch (error) {
    console.error('Erro ao obter novo access token:', error.message);
    return null;
  }
}

export default async function createTicket(req, res) {
  const accessToken = await getNewAccessToken(); 
  if (!accessToken) {
    res.status(500).json({ message: 'Erro ao obter access token' });
    return;
  }

  const ticketData = req.body;

  const form = new FormData();
  form.append('ticketData', JSON.stringify(ticketData)); // Inclui os dados do ticket
  if (req.file) {
    form.append('documento_anexo', req.file.buffer, req.file.originalname); // Inclui o arquivo
  }

  console.log('Ticket data a ser enviado:', ticketData); 

  try {
    const response = await fetch('https://desk.zoho.com/api/v1/tickets', {
      method: 'POST',
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`,
        'orgId': orgId
      },
      body: form // Envia o FormData
    });

    const result = await response.text(); // Captura a resposta como texto
    console.log('Resposta da API Zoho Desk:', result); 

    try {
      const jsonResponse = JSON.parse(result); // Tenta analisar a resposta como JSON
      if (response.ok) {
        res.status(200).json(jsonResponse); 
      } else {
        console.error('Erro ao criar ticket:', jsonResponse);
        res.status(response.status).json({ message: 'Erro ao criar ticket', result: jsonResponse });
      }
    } catch (jsonError) {
      console.error('Erro ao analisar a resposta JSON:', jsonError);
      res.status(500).json({ message: 'Erro ao analisar a resposta da API', result });
    }
  } catch (error) {
    console.error('Erro ao fazer a requisição', error);
    res.status(500).json({ message: 'Erro ao fazer a requisição', error: error.message });
  }
}
