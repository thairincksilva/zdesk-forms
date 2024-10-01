// Inicializar o formulário
document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('cpfCnpj').value = '';
  document.getElementById('cpfCnpjToggle').checked = false;
  toggleCpfCnpj(false);

  // Exibe campos sempre visíveis
  document.getElementById('userData').classList.remove('hidden');
  document.getElementById('additionalFields').classList.remove('hidden');

  // Inicializa com o campo de subcategoria oculto
  document.getElementById('subCategoryContainer').classList.add('hidden');
  document.getElementById('abonoFields').classList.add('hidden');
});

// Lógica para alternar entre CPF/CNPJ
document.getElementById('cpfCnpjToggle').addEventListener('change', function () {
  toggleCpfCnpj(this.checked);
});

function toggleCpfCnpj(isCnpj) {
  const cpfLabel = document.getElementById('cpfLabel');
  const cnpjLabel = document.getElementById('cnpjLabel');
  const cpfCnpjField = document.getElementById('cpfCnpj');

  if (isCnpj) {
    cnpjLabel.classList.add('active');
    cnpjLabel.classList.remove('inactive');
    cpfLabel.classList.add('inactive');
    cpfLabel.classList.remove('active');
    cpfCnpjField.placeholder = 'Digite seu CNPJ';
    cpfCnpjField.maxLength = 18;
  } else {
    cpfLabel.classList.add('active');
    cpfLabel.classList.remove('inactive');
    cnpjLabel.classList.add('inactive');
    cnpjLabel.classList.remove('active');
    cpfCnpjField.placeholder = 'Digite seu CPF';
    cpfCnpjField.maxLength = 14;
  }
}

// Aplicar máscara de CPF/CNPJ em tempo real
document.getElementById('cpfCnpj').addEventListener('input', function () {
  const isCnpj = document.getElementById('cpfCnpjToggle').checked;
  const value = this.value.replace(/\D/g, '');
  if (isCnpj) {
    this.value = value
      .replace(/^(\d{2})(\d)/, '$1.$2')
      .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
      .replace(/\.(\d{3})(\d)/, '.$1/$2')
      .replace(/(\d{4})(\d)/, '$1-$2');
  } else {
    this.value = value
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
      .replace(/(\d{3})(\d{2})$/, '$1-$2');
  }
});

// Ticket types e subcategorias
const ticketTypes = {
  general: [
    'Abono de Multa e Juros', 'Ajuste no Plano de Cobrança', 'Alienar Bem', 'Análise de Reativação', 'Aprovação de Cota Quitada',
    'Avaliação do Bem Imóvel', 'Cancelamento da Oferta de Lance', 'Comprovante de Pagamento', 'Conferência de Proposta',
    'Diversas Cobranças', 'Estorno Sobra de Crédito', 'Registro Contrato de alienação Detran', 'Termo de Liberação de Garantia Imóvel'
  ],
  general_attachment: [
    'Análise Formulário Reativação', 'Atualização SPC/Serasa', 'Aumento de Categoria', 'Cancelamento de Simulação de Transferência',
    'Consultoria Análise App', 'Envio de AF', 'Faturamento do Bem', 'Inclusão de 2º Titular',
    'Liberação de Excesso de Garantia Auto', 'Programação de Devolução de Grupos Encerrados', 'Renegociações de Lance', 'Troca de Bem'
  ],
  custom: [
    'Abono de Multa e Juros', 'Agendamento de vistoria', 'Ajuste no Plano de Cobrança', 'Alienar Bem', 'Alteração Código Comissionado',
    'Análise de Crédito - Interna', 'Análise de transferência', 'Análise faturamento', 'Análise Formulário Reativação',
    'Análise de Reativação', 'Aprovação de Cota Quitada', 'Atualização SPC/Serasa', 'Aumento de Categoria', 'Autorização de Garantia',
    'Avaliação do Bem Imóvel', 'Bloquear Cancelamento da Cota', 'Boletos', 'Cancelamento da Cota', 'Cancelamento da Oferta de Lance',
    'Cancelamento de Simulação de Transferência', 'Cancelar Alienação', 'Comprovante de Pagamento', 'Comprovante de Cotas',
    'Conferência de Proposta', 'Consultoria Análise App', 'Desalienação Cota Quitada', 'Devolução de Parcela Inicial',
    'Devolução de Valores Cota não Cadastrada', 'Descontemplação', 'Devolução de Valores (Geral)', 'Divergência de Contrato Adesões',
    'Diversas Cobranças', 'Emissão de Extrato', 'Envio de AF', 'Estorno Sobra de Crédito', 'Exclusão e inclusão de devedor solidário',
    'Faturamento do Bem Imóvel', 'Faturamento do Bem', 'Inclusão de 2º Titular', 'Liberação de Excesso de Garantia Auto'
  ]
};

// Lógica para exibir subcategorias com base na categoria selecionada
document.getElementById('cf_categoria_do_ticket').addEventListener('change', function () {
  const ticketType = this.value;
  const subCategoryContainer = document.getElementById('subCategoryContainer');
  const subCategorySelect = document.getElementById('cf_tipo_de_solicitacao');

  subCategorySelect.innerHTML = '<option value="0">Selecione</option>'; // Limpa subcategorias
  if (ticketTypes[ticketType]) {
    subCategoryContainer.classList.remove('hidden');
    ticketTypes[ticketType].forEach(function (subCategory) {
      const option = document.createElement('option');
      option.value = subCategory;
      option.text = subCategory;
      subCategorySelect.appendChild(option);
    });
  } else {
    subCategoryContainer.classList.add('hidden');
  }
});

// Lógica para exibir campos adicionais com base na subcategoria
document.getElementById('cf_tipo_de_solicitacao').addEventListener('change', function () {
  const subCategory = this.value;
  const abonoFields = document.getElementById('abonoFields'); // Certifique-se de que o elemento existe

  // Verifica se o elemento existe antes de tentar manipulá-lo
  if (abonoFields) {
    // Verifica se a subcategoria selecionada é "Abono de Multas e Juros"
    if (subCategory === 'Abono de Multa e Juros') {
      abonoFields.classList.remove('hidden');
    } else {
      abonoFields.classList.add('hidden');
    }
  } else {
    console.error('Elemento "abonoFields" não encontrado no DOM.');
  }
});

document.getElementById('cf_tipo_de_solicitacao').addEventListener('change', function () {
  const subCategory = this.value;
  const abonoFields = document.getElementById('abonoFields');

  // Verifica se a subcategoria selecionada é "Abono de Multas e Juros"
  if (subCategory === 'Abono de Multa e Juros') {
    abonoFields.classList.remove('hidden');
  } else {
    abonoFields.classList.add('hidden');
  }
});

// Lógica para enviar o formulário e criar contato/ticket
document.getElementById('ticketForm').addEventListener('submit', async function (event) {
  event.preventDefault();

  const subject = document.getElementById('subject').value;
  const description = document.getElementById('description').value;
  const cpfCnpj = document.getElementById('cpfCnpj').value.replace(/\D/g, '');
  const firstName = document.getElementById('firstName').value;
  const lastName = document.getElementById('lastName').value;
  const email = document.getElementById('email').value;
  const accountName = document.getElementById('accountName').value;
  const phone = document.getElementById('phone').value;
  const mobile = document.getElementById('mobile').value;
  const grupoCota = document.getElementById('cf_grupo_e_cota').value;

  // Função para criar ou obter o contactId
  async function createOrGetContact() {
    const contactData = {
      firstName,
      lastName,
      email,
      accountName,
      phone,
      mobile,
      cpfCnpj
    };

    try {
      const response = await fetch('http://localhost:3000/api/createContact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(contactData)
      });

      const result = await response.json();
      if (response.ok) {
        return result.id; // Retorna o contactId
      } else if (result.message.includes('já existe')) {
        return result.id; // Se o contato já existe, captura o ID
      } else {
        throw new Error('Erro ao criar ou obter contato');
      }
    } catch (error) {
      console.error('Erro ao criar ou obter contato:', error);
      Swal.fire({
        icon: 'error',
        title: 'Erro',
        text: 'Não foi possível criar ou obter o contato. Verifique os dados e tente novamente.',
        confirmButtonText: 'OK'
      });
      throw error;
    }
  }

  try {
    // Obtém ou cria o contato e recupera o contactId
    const contactId = await createOrGetContact();

    // Gera os dados do ticket
    const ticketData = generateTicketDataAbonoMultasJuros(subject, description, contactId, grupoCota, cpfCnpj);

    // Envia o ticket
    const response = await fetch('http://localhost:3000/api/createTicket', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(ticketData)
    });

    const ticketResult = await response.json();

    if (response.ok) {
      Swal.fire({
        icon: 'success',
        title: 'Ticket Criado com Sucesso!',
        text: `Número do ticket: ${ticketResult.ticketNumber}`,
        confirmButtonText: 'OK'
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Erro ao criar ticket',
        text: ticketResult.message || 'Ocorreu um erro ao tentar criar o ticket. Tente novamente!',
        confirmButtonText: 'OK'
      });
    }
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Erro',
      text: 'Não foi possível criar o ticket. Verifique os dados e tente novamente.',
      confirmButtonText: 'OK'
    });
  }
});
