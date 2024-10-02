import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import createTicket from './createTicket.js'; 
import createContact from './createContact.js'; 
import getCustomer from './getCustomer.js';
import getContactByEmail from './getContactByEmail.js';  
import multer from 'multer'; // Importando multer
import fs from 'fs'; 
import path from 'path'; 
import { attachFileToTicket } from './createTicketAttachment.js'; // Importando a função para anexar arquivos

const app = express();
const PORT = process.env.PORT || 3000;

// Configuração do multer
const upload = multer({ dest: 'api/uploads/' }); // O multer irá salvar os arquivos temporariamente nesta pasta

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
app.post('/api/tickets/:ticketId/attachments', upload.single('file'), async (req, res) => {
  const ticketId = req.params.ticketId; // Pega o ID do ticket a partir da rota
  const filePath = req.file.path; // Caminho temporário onde o multer salvou o arquivo

  if (!req.file) {
    return res.status(400).json({ message: 'Nenhum arquivo enviado.' });
  }

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

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
