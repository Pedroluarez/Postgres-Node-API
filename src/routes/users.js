"use strict";

const Router = require("express");
const router = Router();

const user = require("../controllers/users");
const authentication = require("../middleware/auth");

// routers
router.post("/register",authentication.fileUpload, user.createUser);
router.post("/posts", authentication.verifyToken, user.loginPost);
router.post("/login", authentication.validateApp, authentication.limiter, user.loginUser);

module.exports = router;
