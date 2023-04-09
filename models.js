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
  payoutCount: {
    type: Number,
    default: 4,
    required: true,
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  createdDate: {
    type: Date,
    default: new Date(),
    required: true,
  },
});

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  token: String,
  createdDate: {
    type: Date,
    default: new Date(),
    required: true,
  },
});

const HoldingModel = mongoose.model("Holding", HoldingSchema);
const UserModel = mongoose.model("User", UserSchema);

module.exports = { HoldingModel, UserModel };
