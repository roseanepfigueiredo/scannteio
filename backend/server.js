require('dotenv').config();
const cron = require('node-cron');

const { getLiveMatches } = require('./services/apiFootball');
const { checkRules } = require('./services/rulesEngine');
const { sendAlert } = require('./services/notifier');

const sentAlerts = new Set();

cron.schedule('*/1 * * * *', async () => {
  console.log("Verificando jogos...");

  const matches = await getLiveMatches();

  console.log("Quantidade de jogos:", matches.length);

  for (let match of matches) {
    const result = checkRules(match);

    if (!result.triggered) continue;

    const key = `${match.fixture.id}-${result.half}`;

    if (!sentAlerts.has(key)) {
      sentAlerts.add(key);

      const message = `
🚨 ALERTA ${result.level} (${result.half})

⚽ ${match.teams.home.name} vs ${match.teams.away.name}
⏱ Minuto: ${match.fixture.status.elapsed}

📊 Pressão: ${result.pressure.toFixed(1)}%
🔥 APM: ${result.apm.toFixed(2)}
🚩 Escanteios: ${result.corners}
🎯 Chutes: ${result.shots}

📈 Alta probabilidade de escanteios
`;

      await sendAlert(message);
    }
  }
});

console.log("Servidor rodando...");