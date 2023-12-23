"use strict";

const jwt = require("jsonwebtoken");
const pg = require("pg");
const bcrypt = require("bcrypt");
const config = require("../../config");
const pool = new pg.Pool(config.database);
const queries = require("../queries/queries");

module.exports = {
  // create a user
  createUser: async (req, res) => {
    try { 
      const { name, email, age, dob, password } = req.body;
      bcrypt.hash(password, 10, (err, hash) => {
        pool.query(queries.checkEmail, [email], async (error, results) => {
          const isEmptyRequestBody = 
            !req.body || Object.keys(req.body).length === 0;
          const isEmailExist =  results.rows.length;
          if (isEmptyRequestBody)
            return res.status(400).json({
              result: "Failed",
              message: "Invalid or empty request",
            });
          if (isEmailExist)
            return res.status(400).json({
              result: "Failed",
              message: "email already exist!",
            }); 
          const image = req.files.image;
          const imagePath = `src/uploads/${image.name}`;
          image.mv(imagePath, async (err) => {
            if (err) {
              return res.status(500).json({result: "error", message: err.message });
            }
            pool.query(
              queries.postStudent,
              [name, email, age, dob, hash, imagePath],
              (error, results) => {
                if (error) return error;
                res.status(200).json({
                  result: "Success",
                  message: "User created successfully!",
                });
              }
            );  
          }) 
        });
      });
    } catch (error) {
      res.status(500).json({ error: error.message, stack: process.env.NODE_ENV === "development" ? err.stack : null });
    }
  },

  // login user
  loginUser: async (req, res) => {
    try {
      const { name, password } = req.body;
      pool.query(queries.checkName, [name], async (err, results) => {
        const isEmptyRequestBody =
          !req.body || Object.keys(req.body).length === 0;
        const isUserExist = results.rows.length;
        if (isEmptyRequestBody)
          return res.status(400).json({
            result: "Failed",
            message: "Invalid or empty request",
          });
        if (!isUserExist)
          return res.status(401).json({
            result: "Failed",
            message: "User not exist",
          });
        const hashPassword = results.rows[0].password;
        const passwordMatch = await bcrypt.compare(password, hashPassword);
        if (!passwordMatch)
          return res.status(401).json({
            result: "Failed",
            message: "Invalid username or password",
          });
        const tokenSignIn = jwt.sign(
          { name, password },
          config.app.clientSecret,
           {expiresIn: "10s",}
        );
        res.status(200).json({
          result: "Successfully logged in!",
          tokenSignIn,
        });
      });
    } catch (error) {
      res.status(500).json({ error: error.message, stack: process.env.NODE_ENV === "development" ? err.stack : null });
    }
  },

  // check authentication
  loginPost: async (req, res) => {
    try {
      jwt.verify(req.token, config.app.clientSecret, async (err, authData) => {
        if (err)
          return res.status(403).json({
            result: "Forbidden",
            message: "Invalid Token",
          });
       await res.status(200).json({
          result: "authentication success",
          authData,
        });
      });
    } catch (error) {
      res.status(500).json({ error: error.message, stack: process.env.NODE_ENV === "development" ? err.stack : null });
    }
  },
};
