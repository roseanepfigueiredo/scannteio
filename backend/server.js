require('dotenv').config();
const cron = require('node-cron');

const { getLiveMatches, getMatchStatistics } = require('./services/apiFootball');
const { checkRules } = require('./services/rulesEngine');
const { sendAlert } = require('./services/notifier');

const sentAlerts = new Set();

console.log("Servidor rodando...");

cron.schedule('*/1 * * * *', async () => {

  console.log("Verificando jogos...");

  try {

    const matches = await getLiveMatches();

    console.log("TOTAL DE JOGOS:", matches.length);

    for (let match of matches) {

      console.log(
        "JOGO ENCONTRADO:",
        match.teams.home.name,
        "x",
        match.teams.away.name
      );

      try {

        const stats = await getMatchStatistics(match.fixture.id);

        console.log(
          "ESTATISTICAS:",
          match.teams.home.name,
          stats.length
        );

        match.statistics = stats;

        const result = checkRules(match);

        if (!result.triggered) continue;

        const key = `${match.fixture.id}-${result.half}`;

        if (!sentAlerts.has(key)) {

          sentAlerts.add(key);

          await sendAlert(
            `🚨 ALERTA ${match.teams.home.name} x ${match.teams.away.name}`
          );
        }

      } catch (err) {
        console.log("ERRO NO JOGO:", err.message);
      }
    }

  } catch (err) {
    console.log("ERRO GERAL:", err.message);
  }

});