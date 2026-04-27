function checkRules(match) {
  try {
    const e = match.fixture?.status?.elapsed || 0;

    // 🚨 TESTE ABSOLUTO (vai disparar sempre)
    return {
      triggered: true,
      half: "TESTE",
      pressure: 50,
      apm: 1,
      corners: 1,
      shots: 1,
      level: "TESTE"
    };

  } catch (err) {
    console.log("Erro nas regras:", err.message);
    return { triggered: false };
  }
}

module.exports = { checkRules };