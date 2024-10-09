import path from 'path';
import fs from 'fs';
import axios from 'axios';
import FormData from 'form-data';

import { getNewAccessToken } from './auth/auth.js';


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
