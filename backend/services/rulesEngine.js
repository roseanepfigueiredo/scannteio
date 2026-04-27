function checkRules(match) {
  try {
    const e = match.fixture.status.elapsed;

    if (!match.statistics || e === null) {
      return { triggered: false };
    }

    const h = match.statistics[0].statistics;
    const a = match.statistics[1].statistics;

    const g = (s, t) => {
      const f = s.find(x => x.type === t);
      return f ? Number(f.value) || 0 : 0;
    };

    const corners = g(h,"Corner Kicks") + g(a,"Corner Kicks");
    const shots = g(h,"Total Shots") + g(a,"Total Shots");
    const dangerous = g(h,"Dangerous Attacks") + g(a,"Dangerous Attacks");
    const attacks = g(h,"Attacks") + g(a,"Attacks");

    const apm = e > 0 ? dangerous / e : 0;
    const pressure = attacks > 0 ? (dangerous / attacks) * 100 : 0;

    // 🔥 MODO TESTE (FACIL DE DISPARAR)
    if (e >= 5 && shots >= 1) {
      return {
        triggered: true,
        half: "TESTE",
        pressure,
        apm,
        corners,
        shots,
        level: "TESTE"
      };
    }

    // 🔵 REGRAS REAIS (mantidas)
    let level = "NORMAL";

    if (pressure >= 70 && apm >= 1) {
      level = "FORTE";
    }

    if (e <= 45 && pressure >= 60 && corners >= 1 && apm >= 0.8 && shots >= 4) {
      return { triggered: true, half: "1T", pressure, apm, corners, shots, level };
    }

    if (e > 45 && pressure >= 60 && corners >= 6 && shots >= 8 && apm >= 1) {
      return { triggered: true, half: "2T", pressure, apm, corners, shots, level };
    }

    return { triggered: false };

  } catch (err) {
    console.log("Erro nas regras:", err.message);
    return { triggered: false };
  }
}

module.exports = { checkRules };