"use strict";

const Router = require("express");
const router = Router();
// import controller
const userController = require("../controllers/userController");
// import error middleware
const errorMiddleware = require("../middleware/auth");

// routers
router.get("/posts", errorMiddleware.verifyToken, userController.loginPost);
router.post("/login", userController.loginUser);

module.exports = router;
