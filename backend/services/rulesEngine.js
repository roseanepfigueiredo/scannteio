function checkRules(match) {
  try {
    const e = match.fixture.status.elapsed;

    if (!match.statistics || match.statistics.length < 2) {
      console.log("SEM ESTATISTICAS:", match.teams.home.name);
      return { triggered: false };
    }

    const h = match.statistics[0].statistics;
    const a = match.statistics[1].statistics;

    const g = (s, t) => {
      const f = s.find(x => x.type === t);
      return f ? Number(f.value) || 0 : 0;
    };

    const corners = g(h, "Corner Kicks") + g(a, "Corner Kicks");
    const shots = g(h, "Total Shots") + g(a, "Total Shots");
    const dangerous = g(h, "Dangerous Attacks") + g(a, "Dangerous Attacks");
    const attacks = g(h, "Attacks") + g(a, "Attacks");

    const apm = e > 0 ? dangerous / e : 0;
    const pressure = attacks > 0 ? (dangerous / attacks) * 100 : 0;

    console.log(`
JOGO: ${match.teams.home.name}
MIN: ${e}
PRESSAO: ${pressure}
APM: ${apm}
ESC: ${corners}
CHUTES: ${shots}
`);

    return { triggered: false };

  } catch (err) {
    console.log("ERRO DEBUG:", err.message);
    return { triggered: false };
  }
}

module.exports = { checkRules };