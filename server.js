"use strict";

// calling dotenv
require("dotenv").config();
// calling express
const express = require("express");
// calling CORS
const cors = require("cors");
// for env variables file
const PORT = process.env.PORT || 3000;
// import router
const studentRoutes = require("./src/routes/studentRoutes");
const userRoutes = require("./src/routes/userRoutes");
// import error middleware
const errorMiddleware = require("./src/middleware/auth");

const app = express();

// cors function specific
var corsOptions = {
  // specifies who only can access the domain/api
  origin: "http://localhost:5173", // for the frontend localhost
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

// middleware for cors
app.use(cors(corsOptions));
// middleware for express
app.use(express.json());
// using the router
app.use("/api/student", studentRoutes);
app.use("/api/user", userRoutes);

// route
// app.get("/", (req, res) => {
//   res.send("Hello Node");
// });

// listener
app.listen(
  PORT,
  // callback funtion
  () => {
    console.log(`app is listening in PORT localhost:${PORT}`);
  }
);
