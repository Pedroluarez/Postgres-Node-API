"use strict";

const Router = require("express");
const router = Router();

const user = require("../controllers/users");
const authentication = require("../middleware/auth");

// routers
router.post("/register",authentication.fileUpload, user.createUser);
router.post("/posts", authentication.validateToken, user.loginPost);
router.post("/login", authentication.validateLimit, authentication.validateApp, user.loginUser);

module.exports = router;
