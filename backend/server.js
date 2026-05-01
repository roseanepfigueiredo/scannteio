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

    for (let match of matches) {
      try {
        const stats = await getMatchStatistics(match.fixture.id);
        match.statistics = stats;

        const result = checkRules(match);

        if (!result.triggered) continue;

        const key = `${match.fixture.id}-${result.half}-${result.level}`;

        if (!sentAlerts.has(key)) {
          sentAlerts.add(key);

          const message = `
🚨 ALERTA ${result.level}

⚽ ${match.teams.home.name} vs ${match.teams.away.name}
⏱ Minuto: ${match.fixture.status.elapsed}

📊 Score: ${result.score}
📈 Pressão: ${result.pressure.toFixed(1)}%
🔥 Ritmo: ${result.apm.toFixed(2)}

🚩 Escanteios: ${result.corners}
🎯 Chutes: ${result.shots}
`;

          await sendAlert(message);
        }

      } catch (err) {
        console.log("Erro no jogo:", err.message);
      }
    }

  } catch (err) {
    console.log("Erro geral:", err.message);
  }
});