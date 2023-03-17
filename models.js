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
  name: {
    type: String,
    required: false,
  },
  domain: {
    type: String,
    required: false,
  },
  logo: {
    type: String,
    required: false,
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