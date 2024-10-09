import fetch from 'node-fetch';

const clientId = '1000.KC7V3888M7W0M0BYHDFA6ORJV1082L';
const clientSecret = '6686ff0d6d0c7a0a56c46af8daf360cb3700c05852';
const refreshToken = '1000.7631633b3aa2f5fa948d39950b99e53b.621403200d1e679b4e1b22b1bc43c163';
// const refreshToken = '1000.bc146e85c7feab9c9677b9ad571b9400.00b62f491d43d12ad1d12bbaa77d5700'; // old

export async function getNewAccessToken() {
  const tokenUrl = 'https://accounts.zoho.com/oauth/v2/token';
  const params = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    grant_type: 'refresh_token',
    refresh_token: refreshToken
  });

  try { 
    const response = await fetch(tokenUrl, {
      method: 'POST',
      body: params
    });

    // Guarde o texto da resposta em uma variável antes de chamar response.json()
    const responseBody = await response.text(); 
    console.log('Resposta da API de token:', responseBody);

    // Converta a resposta para JSON
    const data = JSON.parse(responseBody); 

    if (response.ok) {
      console.log('Novo access token obtido:', data.access_token);
      return data.access_token; 
    } else {
      throw new Error(`Erro ao renovar o access token: ${data.message}`);
    }
  } catch (error) {
    console.error('Erro ao obter novo access token:', error.message);
    return null;
  }
}




// export async function getNewAccessToken() {
//   const tokenUrl = 'https://accounts.zoho.com/oauth/v2/token';
//   const params = new URLSearchParams({
//     client_id: clientId,
//     client_secret: clientSecret,
//     grant_type: 'refresh_token',
//     refresh_token: refreshToken
//   });

//   try {
//     const response = await fetch(tokenUrl, {
//       method: 'POST',
//       body: params
//     });

//     // Log do que foi retornado pela API
//     console.log('Resposta da API de token:', await response.text());

//     const data = await response.json();

//     if (response.ok) {
//       console.log('Novo access token obtido:', data.access_token);
//       return data.access_token; 
//     } else {
//       throw new Error(`Erro ao renovar o access token: ${data.message}`);
//     }
//   } catch (error) {
//     console.error('Erro ao obter novo access token:', error.message);
//     return null;
//   }
// }
