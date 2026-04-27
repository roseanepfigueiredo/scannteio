const axios = require('axios');

async function getLiveMatches() {
  const response = await axios.get(
    'https://v3.football.api-sports.io/fixtures?live=all',
    {
      headers: {
        'x-apisports-key': process.env.API_KEY
      }
    }
  );

  return response.data.response;
}

module.exports = { getLiveMatches };