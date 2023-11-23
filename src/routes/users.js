"use strict";

const Router = require("express");
const router = Router();

const user = require("../controllers/users");
const error = require("../middleware/auth");

// routers
router.post("/register", user.createUser);
router.post("/posts", error.verifyToken, user.loginPost);
router.post("/login", user.loginUser);

module.exports = router;
