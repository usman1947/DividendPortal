const express = require("express");
const holdingModel = require("../models");
const app = express();
const bp = require('body-parser')
const {historical} = require("./yahooFinance");
const {calculateAverageAnnualGrowth} = require("../utils")

async function createHolding(data){
    let holding = new holdingModel(data);
    const historicalDividendData = await historical(data.ticker); 
    holding.fiveYearCAGR = calculateAverageAnnualGrowth(historicalDividendData)
    return holding
}

exports.createHolding = createHolding;
