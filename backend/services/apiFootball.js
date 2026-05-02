const axios = require('axios');

const API_URL = 'https://v3.football.api-sports.io';

async function getLiveMatches() {

  const today = new Date().toISOString().split('T')[0];

  const response = await axios.get(
    `${API_URL}/fixtures?date=${today}`,
    {
      headers: {
        'x-apisports-key': process.env.API_KEY
      }
    }
  );

  return response.data.response;
}

async function getMatchStatistics(fixtureId) {

  const response = await axios.get(
    `${API_URL}/fixtures/statistics?fixture=${fixtureId}`,
    {
      headers: {
        'x-apisports-key': process.env.API_KEY
      }
    }
  );

  return response.data.response;
}

module.exports = {
  getLiveMatches,
  getMatchStatistics
};