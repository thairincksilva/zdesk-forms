import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import multer from 'multer'; 
import createTicket from './createTicket.js'; 
import createContact from './createContact.js'; 
import getCustomer from './getCustomer.js';
import getContactByEmail from './getContactByEmail.js';  

const app = express();
const PORT = process.env.PORT || 3000;

// configuração do multer para armazenar arquivos em memória
const upload = multer({ storage: multer.memoryStorage() });

// cors pra liberar requisicao de outros dominios
app.use(cors());
app.use(bodyParser.json());

// rota pra criar os tickets
app.post('/api/createTicket', upload.single('documento_anexo'), async (req, res) => {
  try {
    const ticketData = JSON.parse(req.body.ticketData); 
    const file = req.file; 

    if (file) {
      console.log('Arquivo recebido:', file.originalname);
      // nao armazena, apenas envia para o Zoho
    }

    // passa os dados do ticket e o arquivo para a função createTicket
    await createTicket(req, res); 
  } catch (error) {
    console.error('Erro ao criar ticket:', error);
    res.status(500).json({ message: 'Erro interno ao criar ticket' });
  }
});

// rota pra criar os contatos
app.post('/api/createContact', async (req, res) => {
  try {
    await createContact(req, res);
  } catch (error) {
    console.error('Erro ao criar contato:', error);
    res.status(500).json({ message: 'Erro interno ao criar contato' });
  }
});

// rota pra buscar contato pelo ID
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

// rota pra buscar contato pelo email
app.get('/api/getContactByEmail', async (req, res) => {
  await getContactByEmail(req, res);
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
