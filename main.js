document.getElementById('ticketForm').addEventListener('submit', async function (event) {
    event.preventDefault();
  
    const formData = new FormData(this);
    
    // Construir o objeto de dados que será enviado para o Zoho Desk
    const ticketData = {
      subject: formData.get('subject'),
      email: formData.get('email'),
      description: formData.get('description'),
      contactId: '1892000000042032', // Substitua pelo ID correto
      departmentId: '1892000000006907', // Substitua pelo ID correto
      channel: 'Email',
      phone: '1 888 900 9646', // Substitua pelo telefone correto (opcional)
      category: formData.get('category'), // Geral, Geral Anexo ou Personalizado
      cf: {
        cf_phone: formData.get('cpfCnpj'),
        cf_severitypercentage: "0.0",
        cf_modelname: "F3 2017"
      }
    };
  
    // Mostrar mensagem de carregamento
    const feedback = document.getElementById('feedback');
    feedback.textContent = 'Enviando ticket...';
    feedback.classList.remove('hidden');
    
    try {
      // Fazer requisição para a API Zoho Desk
      const response = await fetch('https://desk.zoho.com/api/v1/tickets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Zoho-oauthtoken YOUR_OAUTH_TOKEN_HERE', // Substitua com seu token OAuth
          'orgId': '2389290' // Substitua pelo seu orgId
        },
        body: JSON.stringify(ticketData)
      });
  
      const result = await response.json();
  
      if (response.ok) {
        feedback.textContent = `Ticket enviado com sucesso! Número do ticket: ${result.ticketNumber}`;
      } else {
        feedback.textContent = `Erro ao enviar o ticket: ${result.message}`;
      }
    } catch (error) {
      feedback.textContent = `Erro de conexão: ${error.message}`;
    }
  });