const express = require("express");
const holdingModel = require("./models");
const app = express();
const bp = require('body-parser')
const {quote, search, historical} = require("./services/yahooFinance");
const { createHolding } = require("./services/holding");

app.use(bp.json())
app.use(bp.urlencoded({ extended: true }))

app.get('/healthy', (req, res) => {
    res.send('Healthy');
});

app.get('/', (req, res) => {
  res.send('Server is running');
});

app.post("/addHoldings", async (request, response) => {
  try {
    const holdings = request.body;
    const savedHoldings = await createHolding(holdings);
    response.send(savedHoldings);
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

app.put("/holdings/:id", async (request, response) => {
  const { id } = request.params;
  const updates = request.body;
  try {
    const holding = await holdingModel.findByIdAndUpdate(id, updates, { new: true });
    if (!holding) {
      return response.status(404).send();
    }
    response.send(holding);
  } catch (error) {
    response.status(500).send(error);
  }
});

app.delete("/holdings/:id", async (request, response) => {
  const { id } = request.params;
  try {
    const holding = await holdingModel.findByIdAndDelete(id);
    if (!holding) {
      return response.status(404).send();
    }
    response.send(holding);
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