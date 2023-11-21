// calling express
const express = require("express");
// immport cors
const app = express();
// for env variables file
require("dotenv").config();
const PORT = process.env.PORT || 3000;
// import router
const studentRoutes = require("./src/routes/routes");

// middleware
app.use(express.json());

// route
// app.get("/", (req, res) => {
//   res.send("Hello Node");
// });
// using the router
app.use("/api/v1/student", studentRoutes);

// listener
app.listen(
  PORT,
  // callback funtion
  () => {
    console.log(`app is listening in PORT localhost:${PORT}`);
  }
);
