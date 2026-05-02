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
            process.env.API_KEY,

          include:
            'participants'
        }
      }
    );

  return (
    response.data.data
  );
}

async function getMatchStatistics(
  fixtureId
) {

  const response =
    await axios.get(

      `${API_URL}/fixtures/${fixtureId}`,

      {
        params: {

          api_token:
            process.env.API_KEY,

          include:
            'statistics.participant'
        }
      }
    );

    const stats =
      response
        .data
        .data
        .statistics;

    if (
      !stats ||
      stats.length < 2
    ) {

      return [];
    }

    return stats;
}

module.exports = {

  getLiveMatches,

  getMatchStatistics
};