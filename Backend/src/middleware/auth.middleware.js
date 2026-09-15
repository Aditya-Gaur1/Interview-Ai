const jwt = require("jsonwebtoken");

const tokenBlacklistModel = require("../models/blacklist.model");

async function authUser(req, res, next) {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        message: "Token not provided",
      });
    }

    const isBlacklist = await tokenBlacklistModel.findOne({
      token,
    });

    if (isBlacklist) {
      return res.status(401).json({
        message: "Invalid Token",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;

    next();
  } catch (err) {
    return res.status(401).json({
      message: "Invalid token",
    });
  }
}

module.exports = {
  authUser,
};
