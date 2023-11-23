"use strict";

const jwt = require("jsonwebtoken");
const pg = require("pg");
const bcrypt = require("bcrypt");
const config = require("../../config");
const pool = new pg.Pool(config.database);
const queries = require("../queries/queries");

module.exports = {
  // create a user
  createUser: (req, res) => {
    try {
      const { name, email, age, dob, password } = req.body;
      bcrypt.hash(password, 10, (err, hash) => {
        pool.query(queries.checkEmail, [email], (error, results) => {
          if (results.rows.length) {
            res.send("Email already exists.");
          } else {
            pool.query(
              queries.postStudent,
              [name, email, age, dob, hash],
              (error, results) => {
                if (error) throw error;
                res.status(200).send("User created successfully!");
              }
            );
          }
        });
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // login user
  loginUser: (req, res) => {
    try {
      const { name, password } = req.body;
      pool.query(queries.checkName, [name], async (err, results) => {
        if (results.rows.length) {
          await bcrypt.compare(
            password,
            results.rows[0].password,
            (err, result) => {
              if (result) {
                jwt.sign(
                  { name, password },
                  "secretkey",
                  { expiresIn: "10s" },
                  (err, token) => {
                    res.json({
                      message: "Successfully logged in",
                      token,
                    });
                  }
                );
              } else {
                res.status(401).json({ message: "Wrong credentials" });
              }
            }
          );
        } else {
          res.status(401).json({ message: "Wrong credentials" });
        }
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // check authentication
  loginPost: (req, res) => {
    try {
      jwt.verify(req.token, "secretkey", (err, authData) => {
        if (err) {
          res.sendStatus(403);
        } else {
          res.status(200).json({ status: 200, authData });
        }
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};
