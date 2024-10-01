
// Função para Abono de Multas e Juros
export function generateTicketDataAbonoMultasJuros(subject, description, contactId, grupoCota, cpfCnpj) {
    return {
      subject,
      description,
      departmentId: '1033606000000006907',
      contactId,
      channel: 'Email',
      status: 'Open',
      cf: {
        cf_categoria_do_ticket: 'Geral',
        cf_tipo_de_solicitacao: 'Abono de Multas e Juros',
        cf_grupo_e_cota: grupoCota,
        cf_cpf_cnpj: cpfCnpj
      }
    };
  }
  
  // Função para Ajuste no Plano de Cobrança
  export function generateTicketDataAjustePlanoCobranca(subject, description, contactId, grupoCota, cpfCnpj) {
    return {
      subject,
      description,
      departmentId: '1033606000000006907',
      contactId,
      channel: 'Email',
      status: 'Open',
      cf: {
        cf_categoria_do_ticket: 'Geral',
        cf_tipo_de_solicitacao: 'Ajuste no Plano de Cobrança',
        cf_grupo_e_cota: grupoCota,
        cf_cpf_cnpj: cpfCnpj
      }
    };
  }
  
  // Função para Alienar Bem
  export function generateTicketDataAlienarBem(subject, description, contactId, grupoCota, cpfCnpj) {
    return {
      subject,
      description,
      departmentId: '1033606000000006907',
      contactId,
      channel: 'Email',
      status: 'Open',
      cf: {
        cf_categoria_do_ticket: 'Geral',
        cf_tipo_de_solicitacao: 'Alienar Bem',
        cf_grupo_e_cota: grupoCota,
        cf_cpf_cnpj: cpfCnpj
      }
    };
  }
  
  // Função para Análise de Reativação
  export function generateTicketDataAnaliseReativacao(subject, description, contactId, grupoCota, cpfCnpj) {
    return {
      subject,
      description,
      departmentId: '1033606000000006907',
      contactId,
      channel: 'Email',
      status: 'Open',
      cf: {
        cf_categoria_do_ticket: 'Geral',
        cf_tipo_de_solicitacao: 'Análise de Reativação',
        cf_grupo_e_cota: grupoCota,
        cf_cpf_cnpj: cpfCnpj
      }
    };
  }