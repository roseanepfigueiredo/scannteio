require('dotenv').config();
const cron = require('node-cron');

const {
  getLiveMatches
} = require('./services/apiFootball');

console.log("Servidor rodando...");

cron.schedule('*/1 * * * *', async () => {

  console.log("Verificando jogos...");

  try {

    const matches =
      await getLiveMatches();

    console.log(
      "TOTAL:",
      matches.length
    );

    matches
      .slice(0, 10)
      .forEach(match => {

        console.log(

          "JOGO:",

          match.teams.home.name,

          "| MIN:",

          match.fixture.status.elapsed,

          "| STATUS:",

          match.fixture.status.short

        );

      });

  }
  catch (err) {

    console.log(
      "ERRO:",
      err.message
    );
  }

});