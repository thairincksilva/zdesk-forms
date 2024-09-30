import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import createTicket from './api/createTicket.js'; 
import createContact from './api/createContact.js'; 
import getCustomer from './api/getCustomer.js';  
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

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
