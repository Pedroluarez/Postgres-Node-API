"use strict";

const pg = require("pg");
const config = require("../../config");
const pool = new pg.Pool(config.database);
const isConnected = pool.connect();
module.exports = {
  getStatus: (req, res) => {
    try {
      if (!isConnected)
        return res.status(500).json({
          result: {
            databaseConnection: {
              status: "failed", 
              message: "Database is not-connected",
              error: error.message,
            } 
          } 
        });
      res.status(200).json({
        result: {
          databaseConnection: {
            status: "connected", 
            message: "Database is connected",
          }  
        }
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};
