import { createZohoTicket } from './api/api.js';

// const ticketData = {
//   subject: 'Teste de Integração Automatizada',
//   email: 'marcos.custodio@webpeak.com.br',
//   description: 'Descrição do ticket automatizado via refresh token',
//   departmentId: '1033606000000006907',
//   contactId: '1033606000000316001',
//   channel: 'Email',
//   status: 'Open',
//   cf: {
//     cf_grupo_e_cota: 1234,
//     cf_cpf_cnpj: "088.410.799-08"
//   }
// };

// Função para gerar o ticket de Abono de Multas e Juros com base nas entradas do front-end // estrutura para teste
function generateTicketDataAbonoMultasJuros(subject, description, contactId, grupoCota, cpfCnpj) {
  return {
    subject: subject, // Assunto fornecido pelo usuário no front-end
    description: description, // Descrição fornecida pelo usuário no front-end
    departmentId: '1033606000000006907', // Fixo, o mesmo departmentId sempre
    contactId: contactId, // ID do contato fornecido após a busca ou criação no Zoho Desk (coletado no back-end)
    channel: 'Email', // Sempre será email
    status: 'Open', // Sempre será 'Open'
    cf: {
      cf_categoria_do_ticket: 'Geral', // Fixo, não precisa ser variável
      cf_tipo_de_solicitacao: 'Abono de Multas e Juros', // Fixo para esse tipo de ticket
      cf_grupo_e_cota: grupoCota, // Grupo e Cota fornecido pelo usuário no front-end
      cf_cpf_cnpj: cpfCnpj // CPF/CNPJ fornecido pelo usuário no front-end
    }
  };
}

// Função de exemplo que simula a captura dos dados do front-end e envia o ticket // estrutura na prática
// function enviarTicketAbonoMultasJuros() {
//   // Captura os valores dinâmicos fornecidos pelo usuário no front-end
//   const subject = document.getElementById('subject').value; // Campo assunto no front-end
//   const description = document.getElementById('description').value; // Campo descrição no front-end
//   const contactId = '1033606000000316001'; // Simulação do ID de contato obtido via API
//   const grupoCota = document.getElementById('grupoCota').value; // Campo grupo e cota no front-end
//   const cpfCnpj = document.getElementById('cpfCnpj').value; // Campo CPF/CNPJ no front-end

//   // Gera os dados do ticket com base nas entradas
//   const ticketData = generateTicketDataAbonoMultasJuros(subject, description, contactId, grupoCota, cpfCnpj);

//   // Envia o ticket para a Zoho API
//   createZohoTicket(ticketData);
// }


const ticketData123 = generateTicketDataAbonoMultasJuros("teste de criação de ticket", "teste de descrição", "1033606000000316001", "123445234", "088.410.799-08");


createZohoTicket(ticketData123);