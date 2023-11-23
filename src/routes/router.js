"use strict";

const Router = require("express");
const router = Router();

const status = require("../controllers/status");

// checking status of the API
router.get("/status", status.getStatus);

// routes for users
router.use("/users", require("./users"));

// routes for students
router.use("/students", require("./students"));

module.exports = router;
