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
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 5, // Limit each IP to requests per `window` (here, per 15 minutes).
    message: ({status: 429,
      result: "Failed",
    message: "Too many request, Please try again later",})
    // standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
    // legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
    // store: ... , // Use an external store for consistency across multiple server instances.
  })
};
