"use strict";
require("dotenv").config();
const rateLimit = require("express-rate-limit");
const config = require("../../config")

module.exports = {
  verifyToken: (req, res, next) => {
    try {
      let _clientid = config.app.clientId
      let _clientSecret = config.app.clientSecret

      const authHeader = req.headers["authorization"];
      let clientID = req.headers["client-id"];
      let clientSecret = req.headers["client-secret"];
      if (_clientid !== clientID)
        return res.status(401).json({
          result: "Unathorized",
          message: "Invalid Client Id",
        });
        if (_clientSecret !== clientSecret)
        return res.status(401).json({
          result: "Unathorized",
          message: "Invalid Client Secret",
        });
      if (!authHeader)
        return res.status(401).json({
          result: "Unathorized",
          message: "Invalid Token",
        }); 
      req.token = authHeader;
      next();
    } catch (error) {
      res.status(500).json({ error: error.message, stack: config.app.environment === "development" ? err.stack : null  });
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
