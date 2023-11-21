"use strict";

// calling jsonwebtoken
const jwt = require("jsonwebtoken");
// import db
const pool = require("../../db");
// import queries
const queries = require("../queries/queries");

module.exports = {
  // login user
  loginUser: (req, res) => {
    try {
      // mock user
      const user = {
        id: 3,
        username: "peter",
        email: "peter@gmail.com",
      };
      jwt.sign(user, "secretkey", { expiresIn: "10s" }, (err, token) => {
        res.json({
          user,
          token,
        });
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  // check authentication
  loginPost: (req, res) => {
    jwt.verify(req.token, "secretkey", (err, authData) => {
      if (err) {
        res.sendStatus(403);
      } else {
        res.json({
          message: "Post created!",
          authData,
        });
      }
    });
  },
};
