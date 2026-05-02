function checkRules(match) {
  try {

    const e = match.fixture.status.elapsed;

    if (
      !match.statistics ||
      match.statistics.length < 2 ||
      !e ||
      e < 10
    ) {
      return { triggered: false };
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
      dangerous / e;

    const pressure =
      attacks > 0
        ? (dangerous / attacks) * 100
        : 0;

    let score = 0;

    // pressão
    if (pressure >= 70) {
      score += 40;
    }
    else if (pressure >= 60) {
      score += 30;
    }
    else if (pressure >= 50) {
      score += 20;
    }

    // ritmo
    if (apm >= 1.2) {
      score += 25;
    }
    else if (apm >= 1) {
      score += 20;
    }
    else if (apm >= 0.8) {
      score += 15;
    }

    // chutes
    if (shots >= 10) {
      score += 20;
    }
    else if (shots >= 7) {
      score += 15;
    }
    else if (shots >= 5) {
      score += 10;
    }

    // escanteios
    if (corners >= 8) {
      score += 10;
    }
    else if (corners >= 5) {
      score += 7;
    }
    else if (corners >= 3) {
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

    let level = null;

    if (score >= 70) {
      level = "FORTE";
    }
    else if (score >= 60) {
      level = "MODERADO";
    }

    if (!level) {
      return {
        triggered: false
      };
    }

    return {

      triggered: true,

      half:
        e <= 45
          ? "1T"
          : "2T",

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
      triggered: false
    };
  }
}

module.exports = {
  checkRules
};