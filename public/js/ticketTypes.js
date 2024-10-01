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

// Define os campos dinâmicos por subcategoria
export function getTicketFieldsBySubCategory(subCategory) {
  const fields = [];

  switch (subCategory) {
    case 'Abono de Multa e Juros':
      fields.push({ id: 'cf_grupo_e_cota', label: 'Grupo e Cota', placeholder: 'Digite o grupo e cota', type: 'text' });
      fields.push({ id: 'subject', label: 'Assunto', placeholder: 'Digite o assunto', type: 'text' });
      fields.push({ id: 'description', label: 'Descrição', placeholder: 'Digite a descrição', type: 'textarea' });
      break;

    case 'Ajuste no Plano de Cobrança':
      fields.push({ id: 'cf_grupo_e_cota', label: 'Grupo e Cota', placeholder: 'Digite o grupo e cota', type: 'text' });
      fields.push({ id: 'subject', label: 'Assunto', placeholder: 'Digite o assunto', type: 'text' });
      fields.push({ id: 'description', label: 'Descrição', placeholder: 'Digite a descrição', type: 'textarea' });
      break;

    case 'Alienar Bem':
      fields.push({ id: 'cf_grupo_e_cota', label: 'Grupo e Cota', placeholder: 'Digite o grupo e cota', type: 'text' });
      fields.push({ id: 'subject', label: 'Assunto', placeholder: 'Digite o assunto', type: 'text' });
      fields.push({ id: 'description', label: 'Descrição', placeholder: 'Digite a descrição', type: 'textarea' });
      break;

    case 'Análise de Crédito - Interna':
      fields.push({ id: 'cf_documentos_anexados', label: 'Documentos (anexo)', placeholder: 'Anexe o documento', type: 'file' });
      fields.push({ id: 'cf_tipo_de_analise', label: 'Tipo de Análise', placeholder: '', type: 'select', options: ['Comitê', 'Análise Interna', 'Dispensa de Devedor Solidário', 'Reanálise'] });
      fields.push({ id: 'subject', label: 'Assunto', placeholder: 'Digite o assunto', type: 'text' });
      fields.push({ id: 'description', label: 'Descrição', placeholder: 'Digite a descrição', type: 'textarea' });
      break;

    // Adicione outras subcategorias aqui
  }

  return fields;
}

// Subcategorias por categoria
export function getSubCategoriesByCategory(category) {
  const subCategories = {
    general: [
      'Abono de Multa e Juros',
      'Ajuste no Plano de Cobrança',
      'Alienar Bem',
      'Análise de Reativação'
    ],
    general_attachment: [
      // Adicione subcategorias aqui
    ],
    custom: [
      // Adicione subcategorias aqui
    ]
  };

  return subCategories[category] || [];
}
