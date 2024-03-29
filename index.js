const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const Router = require("./routes");
const cookieParser = require("cookie-parser");

dotenv.config();
const app = express();
app.use(cookieParser());
app.use(express.json());
let corsOptions = {
  origin: function (origin, callback) {
    if (process.env.ORIGIN.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }, credentials: true
}
app.use(cors(corsOptions));

app.use(Router);

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
