import express from 'express';
import bodyParser from 'body-parser';
import multer from'multer';
import cors from 'cors';
import createTicket from './createTicket.js'; 
import createContact from './createContact.js'; 
import getCustomer from './getCustomer.js';
import getContactByEmail from './getContactByEmail.js';  
import { getNewAccessToken } from './accessToken.js';
import { attachFileToTicket } from './createTicketAttachment.js';

const app = express();
const PORT = process.env.PORT || 3000;

const upload = multer({ dest: 'uploads/' });

app.use(cors());

app.post('/api/createTicket/:id/attachments',upload.single('file'), async (req, res) => {
  try {
    await attachFileToTicket(req, res);
  } catch (error) {
    console.error('Erro ao criar ticket:', error);
    res.status(500).json({ message: 'Erro interno ao criar ticket' });
  }
});

app.use(bodyParser.json());

app.post('/api/createTicket', async (req, res) => {
  try {
    await createTicket(req, res);
  } catch (error) {
    console.error('Erro ao criar ticket:', error);
    res.status(500).json({ message: 'Erro interno ao criar ticket' });
  }
});



app.post('/api/createContact', async (req, res) => {
  try {
    await createContact(req, res);
  } catch (error) {
    console.error('Erro ao criar contato:', error);
    res.status(500).json({ message: 'Erro interno ao criar contato' });
  }
});



app.get('/api/accessToken', async (req,res)=>{
  try{
    res.status(200).json(await getNewAccessToken())  
  }catch(error){
    console.error('Erro ao obter novo access token:', error);
    res.status(500).json({ message: 'Erro interno ao criar contato' });
  }
}) 


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

// // Rota para buscar contato pelo email
// app.get('/api/getContactByEmail', async (req, res) => {
//   try {
//     await getContactByEmail(req, res);  // Utilize a função de buscar contato que foi criada no arquivo dedicado
//   } catch (error) {
//     console.error('Erro ao buscar contato:', error);
//     res.status(500).json({ message: 'Erro interno ao buscar contato' });
//   }
// });

// Rota para buscar contato pelo email
app.get('/api/getContactByEmail', async (req, res) => {
  await getContactByEmail(req, res);  // Certifique-se de que essa função está implementada corretamente
});

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
