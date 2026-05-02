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
      "TOTAL RECEBIDO:",
      matches.length
    );

    if (
      matches.length > 0
    ) {

      console.log(

        "PRIMEIRO JOGO:",

        JSON.stringify(
          matches[0],
          null,
          2
        )

      );
    }

  }
  catch (err) {

    console.log(

      "ERRO:",

      err.message

    );
  }

});