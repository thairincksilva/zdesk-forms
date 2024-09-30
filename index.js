import { createZohoTicket } from './api/api.js';

const ticketData = {
  subject: 'Teste de Integração Automatizada',
  email: 'marcos.custodio@webpeak.com.br',
  description: 'Descrição do ticket automatizado via refresh token',
  departmentId: '1033606000000006907',
  contactId: '1033606000000316001',
  channel: 'Email',
  status: 'Open'
};

createZohoTicket(ticketData);
