const express = require("express");
const holdingModel = require("../models");
const app = express();
const bp = require('body-parser')
const {historical} = require("./yahooFinance");
const {calculateAverageAnnualGrowth} = require("../utils")

const createHolding = async (holdings) => {
    try {
      let holdingDocs = holdings.map(holding => new holdingModel(holding));
      holdingDocs.forEach(async holding => {
        const historicalDividendData = await historical(holding.ticker); 
        holding.fiveYearCAGR = calculateAverageAnnualGrowth(historicalDividendData)
      })
      return await holdingModel.insertMany(holdingDocs);
    } catch (error) {
      throw new Error(error);
    }
};

exports.createHolding = createHolding;
