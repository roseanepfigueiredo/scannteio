function checkRules(match) {
  try {

    const e =
      match.fixture.status.elapsed;

    if (
      !match.statistics ||
      match.statistics.length < 2 ||
      !e ||
      e < 1
    ) {
      return {
        triggered: false
      };
    }

    const h =
      match.statistics[0].statistics;

    const a =
      match.statistics[1].statistics;

    const g = (s, t) => {

      const f =
        s.find(
          x => x.type === t
        );

      return f
        ? Number(f.value) || 0
        : 0;
    };

    // 📊 DADOS
    const corners =
      g(h, "Corner Kicks") +
      g(a, "Corner Kicks");

    const shots =
      g(h, "Total Shots") +
      g(a, "Total Shots");

    const dangerous =
      g(h, "Dangerous Attacks") +
      g(a, "Dangerous Attacks");

    const attacks =
      g(h, "Attacks") +
      g(a, "Attacks");

    const apm =
      e > 0
        ? dangerous / e
        : 0;

    const pressure =
      attacks > 0
        ? (dangerous / attacks) * 100
        : 0;

    // 🚪 REGRA BASE
    let passedBaseRule =
      false;

    let half =
      null;

    // 🟢 1T
    if (
      e <= 45 &&
      pressure >= 60 &&
      corners >= 1 &&
      apm >= 0.8 &&
      shots >= 4
    ) {

      passedBaseRule =
        true;

      half = "1T";
    }

    // 🔴 2T
    if (
      e > 45 &&
      pressure >= 60 &&
      corners >= 6 &&
      apm >= 1 &&
      shots >= 8
    ) {

      passedBaseRule =
        true;

      half = "2T";
    }

    // ❌ não bateu sua regra
    if (!passedBaseRule) {

      return {
        triggered: false
      };
    }

    // 🎯 SCORE EXTRA
    let score = 0;

    // pressão
    if (pressure >= 70) {
      score += 40;
    }
    else if (pressure >= 65) {
      score += 30;
    }
    else {
      score += 20;
    }

    // ritmo
    if (apm >= 1.2) {
      score += 25;
    }
    else if (apm >= 1) {
      score += 20;
    }
    else {
      score += 15;
    }

    // chutes
    if (shots >= 10) {
      score += 20;
    }
    else if (shots >= 8) {
      score += 15;
    }
    else {
      score += 10;
    }

    // escanteios
    if (corners >= 8) {
      score += 10;
    }
    else if (corners >= 6) {
      score += 7;
    }
    else {
      score += 5;
    }

    // momento
    if (
      e >= 20 &&
      e <= 35
    ) {
      score += 5;
    }

    if (e >= 70) {
      score += 5;
    }

    // 📈 CLASSIFICAÇÃO
    let level =
      "MODERADO";

    if (
      score >= 80
    ) {

      level =
        "FORTE";
    }

    console.log(`
ALERTA:
${match.teams.home.name}

MIN: ${e}
SCORE: ${score}
PRESSAO: ${pressure}
APM: ${apm}
`);

    return {

      triggered:
        true,

      half,

      pressure,
      apm,
      corners,
      shots,

      score,
      level
    };

  }
  catch (err) {

    console.log(
      "ERRO RULE:",
      err.message
    );

    return {

      triggered:
        false
    };
  }
}

module.exports = {
  checkRules
};