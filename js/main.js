// Inicializar o formulário
document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('cpfCnpj').value = '';
  document.getElementById('cpfCnpjToggle').checked = false;
  toggleCpfCnpj(false);
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

// Lógica para buscar cliente existente ao digitar CPF/CNPJ completo
document.getElementById('cpfCnpj').addEventListener('blur', async function () {
  const cpfCnpjValue = this.value.replace(/\D/g, '');
  const isCnpj = document.getElementById('cpfCnpjToggle').checked;

  if ((isCnpj && cpfCnpjValue.length === 14) || (!isCnpj && cpfCnpjValue.length === 11)) {
    showLoader(true);

    try {
      const response = await fetch(`http://localhost:3000/api/getCustomer/${cpfCnpjValue}`);
      const customerData = await response.json();

      if (response.ok) {
        fillCustomerData(customerData);
      } else {
        showCustomerFields(true);
        Swal.fire({
          icon: 'warning',
          title: 'Ops!',
          text: 'Não encontramos seu cadastro. Preencha as informações abaixo por favor.',
          confirmButtonText: 'OK'
        });
      }
    } catch (error) {
      console.error('Erro ao buscar cliente:', error);
      Swal.fire({
        icon: 'error',
        title: 'Erro de conexão',
        text: 'Não foi possível buscar os dados. Tente novamente mais tarde.',
        confirmButtonText: 'OK'
      });
    } finally {
      showLoader(false);
    }
  }
});

function fillCustomerData(customerData) {
  document.getElementById('firstName').value = customerData.firstName || 'N/A';
  document.getElementById('lastName').value = customerData.lastName || 'N/A';
  document.getElementById('email').value = customerData.email || 'N/A';
  document.getElementById('userData').classList.remove('hidden');
  document.getElementById('firstName').setAttribute('disabled', 'true');
  document.getElementById('lastName').setAttribute('disabled', 'true');
  document.getElementById('email').setAttribute('disabled', 'true');
}

// Exibe os campos para novo cadastro se não encontrar o cliente
function showCustomerFields(show) {
  const fields = document.getElementById('additionalFields');
  fields.classList.toggle('hidden', !show);
}

// Exibe/esconde o loader
function showLoader(show) {
  const loader = document.getElementById('loader');
  loader.classList.toggle('hidden', !show);
}

// Lógica para exibir subcategoria ao selecionar Categoria "Geral"
document.getElementById('cf_categoria_do_ticket').addEventListener('change', function () {
  const ticketType = this.value;
  const subCategoryContainer = document.getElementById('subCategoryContainer');
  const abonoFields = document.getElementById('abonoFields');

  if (ticketType === 'general') {
    subCategoryContainer.classList.remove('hidden');
    document.getElementById('cf_tipo_de_solicitacao').value = '0';
    abonoFields.classList.add('hidden');
  } else {
    subCategoryContainer.classList.add('hidden');
    abonoFields.classList.add('hidden');
  }
});

// Lógica para exibir campos específicos ao selecionar Abono de Multas e Juros
document.getElementById('cf_tipo_de_solicitacao').addEventListener('change', function () {
  const subCategory = this.value;
  const abonoFields = document.getElementById('abonoFields');

  if (subCategory === 'abono_multas_juros') {
    abonoFields.classList.remove('hidden');
  } else {
    abonoFields.classList.add('hidden');
  }
});

// Lógica para enviar o formulário
document.getElementById('ticketForm').addEventListener('submit', async function (event) {
  event.preventDefault();

  const subject = document.getElementById('subject').value;
  const description = document.getElementById('description').value;
  const contactId = document.getElementById('cpfCnpj').value.replace(/\D/g, '');

  const ticketData = {
    subject,
    description,
    contactId,
    departmentId: '1033606000000006907', // Ajuste conforme necessário
    channel: 'Email',
    status: 'Open'
  };

  try {
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
      title: 'Erro de conexão',
      text: 'Ocorreu um erro de conexão. Por favor, tente novamente mais tarde.',
      confirmButtonText: 'OK'
    });
  }
});
