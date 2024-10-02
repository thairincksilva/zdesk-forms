import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import createTicket from './createTicket.js'; 
import createContact from './createContact.js'; 
import getCustomer from './getCustomer.js';
import getContactByEmail from './getContactByEmail.js';  
import Busboy from 'busboy'; 
import fs from 'fs'; 
import path from 'path'; 
import fetch from 'node-fetch'; 
import FormData from 'form-data'; // Importando FormData

const app = express();
const PORT = process.env.PORT || 3000;

// Credenciais Zoho
const clientId = '1000.KC7V3888M7W0M0BYHDFA6ORJV1082L';
const clientSecret = '6686ff0d6d0c7a0a56c46af8daf360cb3700c05852';
const refreshToken = '1000.f6d0ff0e4946d6c8a5bfc4548dba63c1.ac4ddfd4ccf09d513bb45ad7c0424b9f';
const orgId = '861735330'; 

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Função para obter um novo access token
async function getNewAccessToken() {
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
      console.error('Erro ao renovar o access token:', data);
      throw new Error(`Erro ao renovar o access token: ${data.message}`);
    }
  } catch (error) {
    console.error('Erro ao obter novo access token:', error.message);
    return null;
  }
}

// Rota para criar ticket
app.post('/api/createTicket', async (req, res) => {
  try {
    await createTicket(req, res);
  } catch (error) {
    console.error('Erro ao criar ticket:', error);
    res.status(500).json({ message: 'Erro interno ao criar ticket' });
  }
});

// Rota para criar contato
app.post('/api/createContact', async (req, res) => {
  try {
    await createContact(req, res);
  } catch (error) {
    console.error('Erro ao criar contato:', error);
    res.status(500).json({ message: 'Erro interno ao criar contato' });
  }
});

// Rota para buscar cliente pelo ID
app.get('/api/getCustomer/:id', async (req, res) => {
  const customerId = req.params.id;

  try {
    const customer = await getCustomer(customerId);
    if (customer) {
      console.log(`Cliente encontrado: ${JSON.stringify(customer)}`);
      res.status(200).json(customer);
    } else {
      res.status(404).json({ message: 'Cliente não encontrado' });
    }
  } catch (error) {
    console.error('Erro ao buscar cliente:', error);
    res.status(500).json({ message: 'Erro interno ao buscar cliente' });
  }
});

// Rota para buscar contato pelo email
app.get('/api/getContactByEmail', async (req, res) => {
  await getContactByEmail(req, res);  // Certifique-se de que essa função está implementada corretamente
});

// Nova rota para anexar arquivo a um ticket
app.post('/api/tickets/:ticketId/attachments', (req, res) => {
  const busboy = new Busboy({ headers: req.headers });
  const ticketId = req.params.ticketId; // Pega o ID do ticket a partir da rota
  let filePath = '';

  busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
    filePath = path.join(__dirname, 'api/uploads', filename); // Caminho para salvar temporariamente o arquivo
    const writeStream = fs.createWriteStream(filePath);
    file.pipe(writeStream);

    writeStream.on('finish', async () => {
      try {
        const accessToken = await getNewAccessToken(); 
        if (!accessToken) {
          res.status(500).json({ message: 'Erro ao obter access token' });
          return;
        }

        // Criação do FormData para enviar ao Zoho Desk
        const formData = new FormData();
        formData.append('file', fs.createReadStream(filePath)); // Lê o arquivo que foi salvo

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
          res.status(200).json({ message: 'Anexo criado com sucesso!', data });
        } else {
          console.error('Erro ao anexar arquivo:', data);
          res.status(response.status).json({ message: 'Erro ao anexar arquivo', result: data });
        }

        // Opcional: Remover o arquivo após o envio
        fs.unlinkSync(filePath);
      } catch (error) {
        console.error('Erro ao anexar arquivo ao ticket:', error);
        res.status(500).json({ message: 'Erro interno ao anexar arquivo ao ticket' });
      }
    });
  });

  busboy.on('finish', () => {
    // Finaliza a leitura
  });

  req.pipe(busboy); // Conecta o request ao busboy
});

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
