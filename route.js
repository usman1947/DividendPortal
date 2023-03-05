const express = require("express");
const holdingModel = require("./models");
const app = express();
const bp = require('body-parser')

app.use(bp.json())
app.use(bp.urlencoded({ extended: true }))

app.get('/healthy', (req, res) => {
    res.send('Healthy');
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

module.exports = app;