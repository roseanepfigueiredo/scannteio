require('dotenv').config();
const cron = require('node-cron');

const {
  getLiveMatches,
  getMatchStatistics
} = require('./services/apiFootball');

const {
  checkRules
} = require('./services/rulesEngine');

const {
  sendAlert
} = require('./services/notifier');

const sentAlerts = new Set();

console.log("Servidor rodando...");

cron.schedule('*/1 * * * *', async () => {

  console.log("Verificando jogos...");

  try {

    const matches =
      await getLiveMatches();

    // 🔥 SportMonks live
    const filteredMatches =
      matches

        .filter(match => {

          return (

            match.state_id === 2 ||

            match.state_id === 3

          );

        })

        .slice(0, 5);

    console.log(

      "JOGOS FILTRADOS:",

      filteredMatches.length

    );

    for (
      let match of filteredMatches
    ) {

      try {

        console.log(

          "ANALISANDO:",

          match.name

        );

        const stats =
          await getMatchStatistics(
            match.id
          );

        if (
          !stats ||
          stats.length < 2
        ) {

          continue;
        }

        // adapta pro rulesEngine
        match.fixture = {

          status: {

            elapsed: 45
          }
        };

        match.teams = {

          home: {

            name:
              match.participants[0].name
          },

          away: {

            name:
              match.participants[1].name
          }
        };

        match.statistics =
          stats;

        const result =
          checkRules(
            match
          );

        if (
          !result.triggered
        ) {

          continue;
        }

        const key =
          `${match.id}-${result.half}`;

        if (
          sentAlerts.has(
            key
          )
        ) {

          continue;
        }

        sentAlerts.add(
          key
        );

        await sendAlert(`

🚨 ALERTA ${result.level}

⚽ ${match.name}

📊 Score: ${result.score}

📈 Pressão: ${result.pressure.toFixed(1)}%

🔥 APM: ${result.apm.toFixed(2)}

🚩 Escanteios: ${result.corners}

🎯 Chutes: ${result.shots}

`);

      }
      catch (err) {

        console.log(

          "ERRO NO JOGO:",

          err.message

        );
      }
    }

  }
  catch (err) {

    console.log(

      "ERRO GERAL:",

      err.message

    );
  }

});