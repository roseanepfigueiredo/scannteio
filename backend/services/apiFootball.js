const axios = require('axios');

async function getLiveMatches() {
  const response = await axios.get(
    'https://api-football-v1.p.rapidapi.com/v3/fixtures?live=all',
    {
      headers: {
        'x-rapidapi-key': process.env.API_KEY,
        'x-rapidapi-host': 'api-football-v1.p.rapidapi.com'
      }
    }
  );

  return response.data.response;
}

module.exports = { getLiveMatches };