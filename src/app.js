"use strict";

const express = require("express");
const app = express();
const config = require("../config");
const router = require("../src/routes/router"); 
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express"); 
const swaggerOptions = require("../swagger/swagger")
const swaggerResources = require("../swagger/resource"); 

app.use(express.json()); 
 
const swaggerSpec = swaggerJsDoc(swaggerOptions.options);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec)); 

app.use("/api", router);

module.exports = {
  listen: app.listen(config.app.port, (req, res) => {
    try {
      console.log(`[API] App started and listening on port ${config.app.port}`);
    } catch (error) {
      res.status(500).json({ error: error.message, stack: process.env.NODE_ENV === "development" ? err.stack : null });
    }
  }),
};
