"use strict";

const jwt = require("jsonwebtoken");
const pg = require("pg");
const bcrypt = require("bcrypt");
const config = require("../../config");
const pool = new pg.Pool(config.database);
const queries = require("../queries/queries");

module.exports = { 
  createUser: async (req, res) => {
    try {
      const isEmptyRequestBody =
        !req.body || Object.keys(req.body).length === 0;

      if (isEmptyRequestBody)
        return res.status(400).json({
          result: { message: "Invalid or empty request" },
        });

      const { name, email, age, dob, password } = req.body;

      const hashPassword = await bcrypt.hash(password, 10);

      const checkEmail = await pool.query(queries.checkEmail, [email]);

      const checkEmailResult = checkEmail.rows[0].checkstudentemail;

      if (checkEmailResult !== null)
        return res.status(400).json({
          result: {
            message: "Email already used",
          },
        });

      const image = req.files.image;
      const imagePath = `src/uploads/${image.name}`;
      await image.mv(imagePath);

      const queryResults = await pool.query(queries.postStudent, [
        name,
        email,
        age,
        dob,
        hashPassword,
        imagePath,
      ]);

      if (!queryResults)
        return res.status(500).json({
          result: {
            message: error.message,
          },
        });

      res.status(200).json({
        message: "Successfully register", 
      });
    } catch (error) {
      res.status(500).json({
        error: error.message,
        stack: process.env.NODE_ENV === "development" ? err.stack : null,
      });
    }
  },

  // login user
  loginUser: async (req, res) => {
    try {
      const { name, password } = req.body;
      pool.query(queries.checkName, [name], async (err, results) => {
        const isEmptyRequestBody =
          !req.body || Object.keys(req.body).length === 0;
        const isUserExist = results.rows[0].checkname;
        if (isEmptyRequestBody)
          return res.status(400).json({
            result: { message: "Invalid or empty request" },
          });

        if (isUserExist === null)
          return res.status(401).json({
            result: { message: "User not exist" },
          });

        const hashPassword = results.rows[0].checkname.password;
        const passwordMatch = await bcrypt.compare(password, hashPassword);
        if (!passwordMatch)
          return res.status(401).json({
            result: "Failed",
            message: "Invalid username or password",
          });
        const token = jwt.sign({ name, password }, config.app.clientSecret, {
          expiresIn: "1D",
        });
        res.status(200).json({
          result: {
            message: "Successfully logged in!",
            token,
          },
        });
      });
    } catch (error) {
      res.status(500).json({
        error: error.message,
        stack: process.env.NODE_ENV === "development" ? err.stack : null,
      });
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
      res.status(500).json({
        error: error.message,
        stack: process.env.NODE_ENV === "development" ? err.stack : null,
      });
    }
  },
};
