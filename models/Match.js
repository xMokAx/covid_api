const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const matchSchema = new Schema({
  playerId: {
    type: String,
    required: true,
    index: true,
  },
  playerHP: {
    type: Number,
    default: 100,
    min: 0,
    max: 100,
  },
  covidHP: {
    type: Number,
    default: 100,
    min: 0,
    max: 100,
  },
  healthPotions: {
    type: Number,
    default: 3,
    min: 0,
    max: 3,
  },
  timeLeft: {
    type: Number,
    default: 60,
    min: 0,
    max: 60,
  },
  surrender: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Match = mongoose.model("Matches", matchSchema);

mongoose.set("useCreateIndex", true);

exports.createMatch = async (playerId) => {
  const match = new Match({ playerId });
  return match.save();
};

exports.updateMatch = async (playerId, matchId, updatedData) => {
  await Match.updateOne({ playerId, _id: matchId }, updatedData);
};

exports.getMatches = async (playerId) => {
  const matches = await Match.find({ playerId }, "-__v").exec();
  return matches;
};
