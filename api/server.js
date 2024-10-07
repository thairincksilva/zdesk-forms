import express from 'express';
import cors from 'cors';
import createTicket from './createTicket.js'; 
import createContact from './createContact.js'; 
import getCustomer from './getCustomer.js';
import getContactByEmail from './getContactByEmail.js';  
import fileUploadMiddleware from './middleware/handleFilleMiddleware.js'

const app = express();
const PORT = process.env.PORT || 3000;


app.use(cors());

app.post('/api/createTicket',fileUploadMiddleware, async (req, res) => {
  try {
    await createTicket(req, res);
  } catch (error) {
    console.error('Erro ao criar ticket:', error);
    res.status(500).json({ message: 'Erro interno ao criar ticket' });
  }
});

// Rota para criar os tickets
// app.post('/api/createTicket', fileUploadMiddleware, async (req, res) => {
//   try {
//     const ticketData = JSON.parse(req.body.ticketData); // Parseia os dados do ticket
//     const file = req.files.documento_anexo; // Obtém o arquivo anexo

//     if (file) {
//       console.log('Arquivo recebido:', file.filename); // nome do arquivo
//       // Lógica para enviar para o Zoho ou manipular conforme necessário
//     }

//     await createTicket(ticketData, res); // Passa os dados do ticket para a função
//   } catch (error) {
//     console.error('Erro ao criar ticket:', error);
//     res.status(500).json({ message: 'Erro interno ao criar ticket' });
//   }
// });


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
