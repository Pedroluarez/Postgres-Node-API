"use strict";

const Router = require("express");
const router = Router(); 
const authentication = require("../middleware/auth");
const connectionStatus = require("../controllers/connectionStatus");   
 

router.get("/status",authentication.validateApp, connectionStatus.getStatus);
router.use("/users", require("./users"));
router.use("/students", require("./students"));

module.exports = router;
