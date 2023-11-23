"use strict";

module.exports = {
  error: (err, req, res, next) => {
    try {
      const statusCode = res.statusCode ? res.statusCode : 500;
      res.status(statusCode);
      res.json({
        message: err.message,
        stack: process.env.NODE_ENV === "development" ? err.stack : null,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Verify Token
  verifyToken: (req, res, next) => {
    try {
      const authHeader = req.headers["authorization"];
      if (!authHeader) {
        res.json({
          message: "Token is required",
        });
      } else {
        req.token = authHeader;
      }
      next();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};
