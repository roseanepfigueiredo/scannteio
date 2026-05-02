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

    const matches = await getLiveMatches();

    console.log("TOTAL:", matches.length);

    // 🔥 LIMITA PARA 5 JOGOS
    const selectedMatches = matches.slice(0, 5);

    for (let match of selectedMatches) {

      try {

        console.log(
          "ANALISANDO:",
          match.teams.home.name
        );

        const stats = await getMatchStatistics(
          match.fixture.id
        );

        match.statistics = stats;

        const result = checkRules(match);

        if (!result.triggered) continue;

        const key =
          `${match.fixture.id}-${result.half}`;

        if (sentAlerts.has(key)) continue;

        sentAlerts.add(key);

        await sendAlert(`
🚨 ${result.level}

⚽ ${match.teams.home.name} x ${match.teams.away.name}

📊 Score: ${result.score}
⏱ ${match.fixture.status.elapsed}'

🔥 APM: ${result.apm.toFixed(2)}
📈 Pressão: ${result.pressure.toFixed(1)}%
🚩 Escanteios: ${result.corners}
🎯 Chutes: ${result.shots}
`);

      } catch (err) {

        console.log(
          "ERRO NO JOGO:",
          err.message
        );
      }
    }

  } catch (err) {

    console.log(
      "ERRO GERAL:",
      err.message
    );
  }

});