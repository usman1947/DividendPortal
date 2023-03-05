const yahooFinance = require('yahoo-finance2').default; 
const {subtractYears, calculateAverageAnnualGrowth} = require("../utils")

async function quote(symbol){
    const results = await yahooFinance.quote(symbol);
    return results
}

async function search(symbol){
    const results = await yahooFinance.quote(symbol);
    return results
}

async function historical(symbol, event="dividends"){
    const today = new Date();
    const queryOptions = { 
        period1: subtractYears(today, 10),
        period2: today,
        interval: '1mo',
        events: event,
    };
    const results = await yahooFinance.historical(symbol, queryOptions);
    return results
}

exports.quote = quote;
exports.search = search;
exports.historical = historical;