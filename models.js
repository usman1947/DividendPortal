const mongoose = require("mongoose");

const HoldingSchema = new mongoose.Schema({
  ticker: {
    type: String,
    required: true,
  },
  shares: {
    type: Number,
    default: 0,
    required: true,
  },
  cost: {
    type: Number,
    default: 0,
    required: true,
  },
  sector: {
    type: String,
    required: true,
  },
  fiveYearCAGR: {
    type: Number,
    default: 0,
    required: true,
  },
  createdDate: {
    type: Date,
    default: new Date(),
    required: true,
  },
});

const Holding = mongoose.model("Holding", HoldingSchema);

module.exports = Holding;