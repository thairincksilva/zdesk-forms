import fetch from 'node-fetch';
import path from 'path';
import fs from 'fs';
import axios from 'axios';
import FormData from 'form-data';


const clientId = '1000.KC7V3888M7W0M0BYHDFA6ORJV1082L';
const clientSecret = '6686ff0d6d0c7a0a56c46af8daf360cb3700c05852';
const refreshToken = '1000.7631633b3aa2f5fa948d39950b99e53b.621403200d1e679b4e1b22b1bc43c163';
const orgId = '861735330';


export async function getNewAccessToken() {
  const tokenUrl = 'https://accounts.zoho.com/oauth/v2/token';
  const params = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    grant_type: 'refresh_token',
    refresh_token: refreshToken,
  });

  try {
    const response = await fetch(tokenUrl, {
      method: 'POST',
      body: params,
    });

    const data = await response.json();

    if (response.ok) {
      console.log('Novo access token obtido:', data.access_token);
      return data.access_token;
    } else {
      console.error('Erro ao renovar o access token:', data);
      throw new Error(`Erro ao renovar o access token: ${data.message}`);
    }
  } catch (error) {
    console.error('Erro ao obter novo access token:', error.message);
    return null;
  }
}

// Função para anexar um arquivo a um ticket
export async function attachFileToTicket(req, res) {
  const accessToken = await getNewAccessToken();

  if (!accessToken) {
    throw new Error('Não foi possível obter o access token');
  }
  const ticketId = req.params.id 
  const filePath = path.join(process.cwd(), req.file.path)

  const formData = new FormData();
  formData.append('file', fs.createReadStream(filePath), req.file.originalname)

  const headers = formData.getHeaders();
  
  const url = `https://desk.zoho.com/api/v1/tickets/${ticketId}/attachments`;

  try{
    const response = await axios.post(url,formData, {
      headers: {
        ...headers,
        'orgId': orgId,
        'Authorization': `Zoho-oauthtoken ${accessToken}`,
      },
    });
  
    fs.unlinkSync(filePath);
  
  
    console.log('Anexo criado com sucesso:', response.data);
    return res.status(200).json(response.data);
  }catch(error){
    console.error('Erro ao anexar arquivo:', error.response?.data || error.message);
      
    const errorMessage = error.response?.data?.message || 'Erro ao anexar arquivo';
    return res.status(500).json({ error: errorMessage });
  }
}
