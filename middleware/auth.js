const { UserModel } = require("../models");
const jwt = require("jsonwebtoken");

const isAuthenticated = async (req, res, next) => {
  try {
    if (!req.cookies) {
      return next("Please add cookies to your request");
    }
    const { token } = req.cookies;
    if (!token) {
      return next("Please login to access the data");
    }
    const verify = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await UserModel.findById(verify.id);
    next();
  } catch (error) {
    return next(error);
  }
};

module.exports = isAuthenticated;
