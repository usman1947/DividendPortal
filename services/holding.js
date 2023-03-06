const express = require("express");
const holdingModel = require("../models");
const app = express();
const bp = require('body-parser')
const {historical} = require("./yahooFinance");
const {calculateAverageAnnualGrowth} = require("../utils")

const createHolding = async (holdings) => {
    try {
      const holdingDocs = await Promise.all(
        holdings.map(async (holding) => {
          const historicalDividendData = await historical(holding.ticker);
          const fiveYearCAGR = calculateAverageAnnualGrowth(historicalDividendData);
          return new holdingModel({
            ...holding,
            fiveYearCAGR,
          });
        })
      );
      return await holdingModel.insertMany(holdingDocs);
    } catch (error) {
      throw new Error(error);
    }
  };
  

exports.createHolding = createHolding;
