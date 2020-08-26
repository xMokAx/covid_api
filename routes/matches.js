const { tokenValidation } = require("../utils/validation");
const { createMatch, updateMatch, getMatches } = require("../models/Match");

module.exports = function (app) {
  app.post("/matches", tokenValidation, async (req, res) => {
    if (!req.body.playerId) {
      return res.status(400).send({ error: "playerId is missing" });
    }
    const match = await createMatch(req.body.playerId);
    res.send({ match });
  });

  app.get("/matches", tokenValidation, async (req, res) => {
    if (!req.query.playerId) {
      return res.status(400).send({ error: "playerId is missing" });
    }
    const matches = await getMatches(req.query.playerId);
    res.send({ matches });
  });

  app.patch("/matches/:matchId", tokenValidation, async (req, res) => {
    const { playerId, match } = req.body;
    if (!playerId || !match) {
      return res.status(400).send({ error: "Missing fields" });
    }
    await updateMatch(playerId, req.params.matchId, match);
    res.end();
  });
};
