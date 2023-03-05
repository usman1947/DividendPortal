const express = require("express");
const holdingModel = require("./models");
const app = express();
const bp = require('body-parser')
const {quote, search, historical} = require("./services/yahooFinance");

app.use(bp.json())
app.use(bp.urlencoded({ extended: true }))

app.get('/healthy', (req, res) => {
    res.send('Healthy');
});

app.get('/', (req, res) => {
  res.send('Server is running');
});

app.post("/addHolding", async (request, response) => {
    console.log(request);
    const holding = new holdingModel(request.body);
    try {
      await holding.save();
      response.send(holding);
    } catch (error) {
      response.status(500).send(error);
    }
});


app.get("/holdings", async (request, response) => {
    const holdings = await holdingModel.find();
    try {
      response.send(holdings);
    } catch (error) {
      response.status(500).send(error);
    }
});

app.get("/search", async (request, response) => {
  try {
    const result = await search(request.query.symbol);
    response.send(result);
  } catch (error) {
    response.status(500).send(error);
  }
});

app.get("/quote", async (request, response) => {
  try {
    const result = await quote(request.query.symbol);
    response.send(result);
  } catch (error) {
    response.status(500).send(error);
  }
});

app.get("/historical", async (request, response) => {
  try {
    const result = await historical(request.query.symbol);
    response.send(result);
  } catch (error) {
    response.status(500).send(error);
  }
});

module.exports = app;