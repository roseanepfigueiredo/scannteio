const axios = require('axios');

const API_URL =
  'https://api.sportmonks.com/v3/football';

async function getLiveMatches() {

  const response =
    await axios.get(

      `${API_URL}/livescores`,

      {
        params: {

          api_token:
            process.env.API_KEY
        }
      }
    );

  console.log(

    "SPORTMONKS:",

    JSON.stringify(
      response.data,
      null,
      2
    )

  );

  return [];
}

async function getMatchStatistics() {

  return [];
}

module.exports = {

  getLiveMatches,

  getMatchStatistics
};