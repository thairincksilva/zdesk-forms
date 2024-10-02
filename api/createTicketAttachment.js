import fetch from 'node-fetch';
import FormData from 'form-data';
import fs from 'fs';

const clientId = '1000.KC7V3888M7W0M0BYHDFA6ORJV1082L';
const clientSecret = '6686ff0d6d0c7a0a56c46af8daf360cb3700c05852';
const refreshToken = '1000.f6d0ff0e4946d6c8a5bfc4548dba63c1.ac4ddfd4ccf09d513bb45ad7c0424b9f';
const orgId = '861735330';

// Função para obter um novo access token
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
export async function attachFileToTicket(ticketId, filePath) {
  const accessToken = await getNewAccessToken();

  if (!accessToken) {
    throw new Error('Não foi possível obter o access token');
  }

  const formData = new FormData();
  formData.append('file', fs.createReadStream(filePath));

  const url = `https://desk.zoho.com/api/v1/tickets/${ticketId}/attachments`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'orgId': orgId,
      'Authorization': `Zoho-oauthtoken ${accessToken}`,
      ...formData.getHeaders(),
    },
    body: formData,
  });

  const data = await response.json();

  if (response.ok) {
    console.log('Anexo criado com sucesso:', data);
    return data;
  } else {
    console.error('Erro ao anexar arquivo:', data);
    throw new Error(`Erro ao anexar arquivo: ${data.message}`);
  }
}
