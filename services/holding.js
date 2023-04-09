const ClearbitLogo = require("clearbit-logo");
let logo = new ClearbitLogo();
const express = require("express");
const { HoldingModel } = require("../models");
const app = express();
const bp = require("body-parser");
const { historical, quote } = require("./yahooFinance");
const {
  calculateAverageAnnualGrowth,
  getDividendPayoutCount,
} = require("../utils");

const createHolding = async (holdings, userId) => {
  try {
    const holdingDocs = await Promise.all(
      holdings.map(async (holding) => {
        const historicalDividendData = await historical(holding.ticker);
        const data = await quote(holding.ticker);
        const payoutCount = getDividendPayoutCount(historicalDividendData);
        const fiveYearCAGR = calculateAverageAnnualGrowth(
          historicalDividendData
        );
        const companyInformation = await getLogo(
          data.displayName ?? data.shortName ?? data.longName
        );
        return new HoldingModel({
          ...holding,
          ...(companyInformation && companyInformation),
          fiveYearCAGR,
          payoutCount,
          user_id: userId,
        });
      })
    );
    return await HoldingModel.insertMany(holdingDocs);
  } catch (error) {
    throw new Error(error);
  }
};

async function getLogo(name) {
  return await logo.topSuggestion(name);
}

exports.createHolding = createHolding;
