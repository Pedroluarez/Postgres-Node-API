"use strict";

const Router = require("express");
const router = Router();

const connectionStatus = require("../controllers/connectionStatus");


// checking status of the API
router.get("/status", connectionStatus.getStatus);

// routes for users
router.use("/users", require("./users"));

// routes for students
router.use("/students", require("./students"));

module.exports = router;
