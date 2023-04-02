const express = require("express");
const { HoldingModel, UserModel } = require("./models");
const app = express();
const dotenv = require("dotenv");
const bp = require("body-parser");
const { quote, search, historical } = require("./services/yahooFinance");
const { createHolding } = require("./services/holding");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
dotenv.config();
const isAuthenticated = require("./middleware/auth");

app.use(bp.json());
app.use(bp.urlencoded({ extended: true }));

function getToken(id) {
  return jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
}

app.get("/healthy", (req, res) => {
  res.send("Healthy");
});

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.post("/addHoldings", isAuthenticated, async (request, response) => {
  try {
    const holdings = request.body;
    const savedHoldings = await createHolding(holdings, request.user._id);
    response.send(savedHoldings);
  } catch (error) {
    response.status(500).send(error);
  }
});

app.get("/holdings", isAuthenticated, async (request, response) => {
  const userId = request.user._id;
  const holdings = await HoldingModel.find().where("user_id").in(userId).exec();
  try {
    response.send(holdings);
  } catch (error) {
    response.status(500).send(error);
  }
});

app.put("/holding/:id", isAuthenticated, async (request, response) => {
  const { id } = request.params;
  const updates = request.body;
  try {
    const holding = await HoldingModel.findByIdAndUpdate(id, updates, {
      new: true,
    });
    if (!holding) {
      return response.status(404).send();
    }
    response.send(holding);
  } catch (error) {
    response.status(500).send(error);
  }
});

app.delete("/holding/:id", isAuthenticated, async (request, response) => {
  const { id } = request.params;
  try {
    const holding = await HoldingModel.findByIdAndDelete(id);
    if (!holding) {
      return response.status(404).send();
    }
    response.send(holding);
  } catch (error) {
    response.status(500).send(error);
  }
});

app.get("/search", isAuthenticated, async (request, response) => {
  try {
    const result = await search(request.query.symbol);
    response.send(result);
  } catch (error) {
    response.status(500).send(error);
  }
});

app.get("/quote", isAuthenticated, async (request, response) => {
  try {
    const result = await quote(request.query.symbol);
    response.send(result);
  } catch (error) {
    response.status(500).send(error);
  }
});

app.get("/historical", isAuthenticated, async (request, response) => {
  try {
    const result = await historical(request.query.symbol);
    response.send(result);
  } catch (error) {
    response.status(500).send(error);
  }
});

app.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    //Check empty-ness of the incoming data
    if (!name || !email || !password) {
      return res.json({
        success: false,
        message: "Please enter all the details",
      });
    }

    //Check if the user already exist or not
    const userExist = await UserModel.findOne({ email: email });
    if (userExist) {
      return res.json({
        success: false,
        message: "User already exist with the given email",
      });
    }

    //Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);
    req.body.password = hashPassword;
    const user = new UserModel(req.body);
    await user.save();
    const token = getToken(user._id);
    return res
      .cookie("token", token, {
        httpOnly: process.env.NODE_ENV === "production",
      })
      .json({
        success: true,
        message: "User registered successfully",
        data: { id: user._id, name: user.name },
      });
  } catch (error) {
    console.log(error);
    return res.json({ error: error });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    //Check empty-ness of the incoming data
    if (!email || !password) {
      return res.json({
        message: "Please enter all the details",
        success: false,
      });
    }

    //Check if the user already exist or not
    const userExist = await UserModel.findOne({ email: email });
    if (!userExist) {
      return res.json({ message: "Wrong credentials", success: false });
    }

    //Check password match
    const isPasswordMatched = await bcrypt.compare(
      password,
      userExist.password
    );

    if (!isPasswordMatched) {
      return res.json({ message: "Incorrect Password", success: false });
    }

    const token = getToken(userExist._id);
    userExist.token = token;
    await userExist.save();
    return res
      .cookie("token", token, {
        httpOnly: process.env.NODE_ENV === "production",
      })
      .json({
        success: true,
        message: "LoggedIn Successfully",
        data: { id: userExist._id, name: userExist.name },
      });
  } catch (error) {
    console.log(error);
    return res.json({ error: error });
  }
});

module.exports = app;
