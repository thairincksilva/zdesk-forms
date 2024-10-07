import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import createTicket from './createTicket.js'; 
import createContact from './createContact.js'; 
import getCustomer from './getCustomer.js';
import getContactByEmail from './getContactByEmail.js';  

const app = express();
const PORT = process.env.PORT || 3000;


app.use(cors());
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
    console.error('Erro ao criar contato:', error);
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

app.post('/api/ticket/:id/attachments', async (req, res) => {
  const ticketId = req.params.id;
  const accessToken = await getNewAccessToken();

  if (!accessToken) {
    return res.status(500).json({ message: 'Erro ao obter access token' });
  }

  const formData = req.body; // Certifique-se de que você está recebendo o anexo corretamente

  try {
    const response = await fetch(`https://desk.zoho.com/api/v1/tickets/${ticketId}/attachments`, {
      method: 'POST',
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`,
        'Content-Type': 'multipart/form-data',
      },
      body: formData, // Certifique-se de que está enviando os dados corretamente
    });

    const result = await response.json();

    if (response.ok) {
      return res.status(200).json(result);
    } else {
      return res.status(response.status).json({ message: 'Erro ao enviar anexo', result });
    }
  } catch (error) {
    console.error('Erro ao enviar anexo:', error);
    return res.status(500).json({ message: 'Erro ao enviar anexo', error });
  }
});