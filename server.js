// calling express
const express = require("express");
const app = express();
const PORT = 3000;
// import router
const studentRoutes = require("./src/students/routes");

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
