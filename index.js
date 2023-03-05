const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require("mongoose");
const Router = require("./routes")

dotenv.config();
const app = express();
app.use(Router);
app.use(cors());
app.use(express.json());

//db connection
mongoose.connect(process.env.MONGO_URI);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
  console.log("Connected to db successfully");
});

//starting app to listen on port
app.listen(process.env.PORT, () => {
  console.log(`Listening on port ${process.env.PORT}!`);
});

