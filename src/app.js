"use strict";

const express = require("express");
const app = express();
const config = require("../config");
const router = require("../src/routes/router"); 
const swaggerUi = require("swagger-ui-express"); 
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./swagger.yaml');

app.use(express.json()); 
  
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));



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
