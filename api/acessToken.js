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
  
      const data = await response.json();
  
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