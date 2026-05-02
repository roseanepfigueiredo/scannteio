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

    // 🔥 apenas jogos realmente ao vivo
    const filteredMatches =
      matches
        .filter(m => {

          const minute =
            m.fixture?.status?.elapsed || 0;

          const status =
            m.fixture?.status?.short;

          return (

            minute >= 1 &&

            status !== "HT" &&

            status !== "FT"

          );

        })

        // evita erro 429
        .slice(0, 10);

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

          match.teams.home.name,

          match.fixture.status.elapsed

        );

        const stats =
          await getMatchStatistics(
            match.fixture.id
          );

        if (
          !stats ||
          stats.length < 2
        ) {

          continue;
        }

        match.statistics =
          stats;

        const result =
          checkRules(match);

        if (
          !result.triggered
        ) {

          continue;
        }

        const key =
          `${match.fixture.id}-${result.half}`;

        if (
          sentAlerts.has(key)
        ) {

          continue;
        }

        sentAlerts.add(
          key
        );

        await sendAlert(`

🚨 ALERTA ${result.level}

⚽ ${match.teams.home.name} x ${match.teams.away.name}

⏱ ${match.fixture.status.elapsed}'

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