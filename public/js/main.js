import { getSubCategoriesByCategory, getTicketFieldsBySubCategory, generateTicketDataAbonoMultasJuros, generateTicketDataAjustePlanoCobranca, generateTicketDataAlienarBem } from './ticketTypes.js';

console.log("main.js carregado com sucesso!");

// Inicializar o formulário
document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('cpfCnpj').value = '';
  document.getElementById('cpfCnpjToggle').checked = false;
  toggleCpfCnpj(false);

  // Exibe campos sempre visíveis
  document.getElementById('contactFields').classList.remove('hidden');
  document.getElementById('dynamicFields').classList.remove('hidden');

  // Inicializa com o campo de subcategoria oculto
  document.getElementById('subCategoryContainer').classList.add('hidden');
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

// Lógica para exibir subcategorias com base na categoria selecionada
document.getElementById('cf_categoria_do_ticket').addEventListener('change', function () {
  const category = this.value;
  const subCategoryContainer = document.getElementById('subCategoryContainer');
  const subCategorySelect = document.getElementById('cf_tipo_de_solicitacao');
  
  const subCategories = getSubCategoriesByCategory(category);
  
  console.log('Categoria selecionada:', category);  // Depuração
  console.log('Subcategorias encontradas:', subCategories);  // Depuração

  subCategorySelect.innerHTML = '<option value="0">Selecione</option>'; // Limpa subcategorias
  if (subCategories.length) {
    subCategoryContainer.classList.remove('hidden');
    subCategories.forEach(function (subCategory) {
      const option = document.createElement('option');
      option.value = subCategory;
      option.text = subCategory;
      subCategorySelect.appendChild(option);
    });
  } else {
    subCategoryContainer.classList.add('hidden');
    console.error('Nenhuma subcategoria encontrada para a categoria:', category); // Depuração
  }
});

// Lógica para exibir campos adicionais com base na subcategoria
document.getElementById('cf_tipo_de_solicitacao').addEventListener('change', function () {
  const subCategory = this.value;
  const dynamicFields = document.getElementById('dynamicFields');
  
  dynamicFields.innerHTML = ''; // Limpa os campos adicionais

  const fields = getTicketFieldsBySubCategory(subCategory);

  if (fields.length > 0) {
    fields.forEach(function (field) {
      const fieldContainer = document.createElement('div');
      const label = document.createElement('label');
      label.className = 'block text-gray-700';
      label.textContent = field.label;

      let input;
      if (field.type === 'textarea') {
        input = document.createElement('textarea');
        input.rows = '4';
      } else if (field.type === 'select') {
        input = document.createElement('select');
        field.options.forEach(optionValue => {
          const option = document.createElement('option');
          option.value = optionValue;
          option.text = optionValue;
          input.appendChild(option);
        });
      } else {
        input = document.createElement('input');
        input.type = field.type;
      }

      input.id = field.id;
      input.name = field.id;
      input.placeholder = field.placeholder;
      input.className = 'w-full p-2 border border-gray-300 rounded';

      fieldContainer.appendChild(label);
      fieldContainer.appendChild(input);
      dynamicFields.appendChild(fieldContainer);
    });

    dynamicFields.classList.remove('hidden');
  } else {
    dynamicFields.classList.add('hidden');
  }
});

// Função para verificar se o contato já existe no Zoho Desk
async function checkIfContactExists(email) {
  try {
    const response = await fetch(`http://localhost:3000/api/getContactByEmail?email=${email}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const result = await response.json();
    if (response.ok && result.data && result.data.length > 0) {
      // Retorna o primeiro contato encontrado
      return result.data[0]; // Assumindo que result.data é um array de contatos
    }
    return null; // Se não encontrar nenhum contato, retorna null
  } catch (error) {
    console.error('Erro ao verificar contato existente:', error);
    return null;
  }
}

// Função para criar ou obter o contactId
async function createOrGetContact() {
  const email = document.getElementById('email').value;

  // Verificar se o contato já existe
  const existingContact = await checkIfContactExists(email);

  if (existingContact) {
    console.log('Contato existente encontrado:', existingContact);
    return existingContact.id; // Retorna o contactId existente
  } else {
    console.log('Nenhum contato existente. Criando novo contato...');
    // Se o contato não existe, cria um novo
    const contactData = {
      firstName: document.getElementById('firstName').value,
      lastName: document.getElementById('lastName').value,
      email: email,
      phone: document.getElementById('phone').value,
      mobile: document.getElementById('mobile').value,
      cpfCnpj: document.getElementById('cpfCnpj').value.replace(/\D/g, ''),
    };

    try {
      const response = await fetch('http://localhost:3000/api/createContact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contactData),
      });

      const result = await response.json();
      if (response.ok) {
        return result.id; // Retorna o novo contactId
      } else {
        throw new Error('Erro ao criar contato');
      }
    } catch (error) {
      console.error('Erro ao criar contato:', error);
      Swal.fire({
        icon: 'error',
        title: 'Erro',
        text: 'Não foi possível criar ou obter o contato. Verifique os dados e tente novamente.',
        confirmButtonText: 'OK',
      });
      throw error;
    }
  }
}

// Lógica para enviar o formulário e criar contato/ticket
document.getElementById('ticketForm').addEventListener('submit', async function (event) {
  event.preventDefault();

  const subject = document.getElementById('subject').value;
  const description = document.getElementById('description').value;
  const cpfCnpj = document.getElementById('cpfCnpj').value.replace(/\D/g, '');
  const firstName = document.getElementById('firstName').value;
  const lastName = document.getElementById('lastName').value;
  const email = document.getElementById('email').value;
  const phone = document.getElementById('phone').value;
  const mobile = document.getElementById('mobile').value;
  const grupoCota = document.getElementById('cf_grupo_e_cota') ? document.getElementById('cf_grupo_e_cota').value : '';

  try {
    // Obtém ou cria o contato e recupera o contactId
    const contactId = await createOrGetContact();

    const subCategory = document.getElementById('cf_tipo_de_solicitacao').value;

    let ticketData;

    // Chama a função correspondente ao tipo de subcategoria
    switch (subCategory) {
      case 'Abono de Multa e Juros':
        ticketData = generateTicketDataAbonoMultasJuros(subject, description, contactId, grupoCota, cpfCnpj);
        break;
      case 'Ajuste no Plano de Cobrança':
        ticketData = generateTicketDataAjustePlanoCobranca(subject, description, contactId, grupoCota, cpfCnpj);
        break;
      case 'Alienar Bem':
        ticketData = generateTicketDataAlienarBem(subject, description, contactId, grupoCota, cpfCnpj);
        break;
      default:
        throw new Error('Subcategoria inválida ou não implementada');
    }

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
