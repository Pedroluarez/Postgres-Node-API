"use strict";
require("dotenv").config();
const rateLimit = require("express-rate-limit");

module.exports = {
  verifyToken: (req, res, next) => {
    try {
      const authHeader = req.headers["authorization"];
      if (!authHeader)
        return res.status(401).json({
          result: "Unathorized",
          message: "Invalid Token",
        });
      req.token = authHeader;
      next();
    } catch (error) {
      res.status(500).json({ error: error.message, stack: process.env.NODE_ENV === "development" ? err.stack : null  });
    }
  },

   limiter : rateLimit({
    windowMs: 1 * 60 * 1000, 
    max: 5, 
    message: ({status: 429,
      result: "Failed",
    message: "Too many request, Please try again later",})
  })
};
