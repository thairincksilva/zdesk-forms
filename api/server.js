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
import { attachFileToTicket } from './createTicketAttachment.js'; // Importando a função para anexar arquivos

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

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
        // Chamando a função de anexar arquivo a partir de createTicketAttachment.js
        const response = await attachFileToTicket(ticketId, filePath);
        res.status(200).json({ message: 'Anexo criado com sucesso!', data: response });
      } catch (error) {
        console.error('Erro ao anexar arquivo ao ticket:', error);
        res.status(500).json({ message: 'Erro interno ao anexar arquivo ao ticket' });
      } finally {
        // Remover o arquivo após o envio
        fs.unlinkSync(filePath);
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
