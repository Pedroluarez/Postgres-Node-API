"use strict";

const Router = require("express");
const router = Router();

const user = require("../controllers/users");
const authentication = require("../middleware/auth");

// routers
router.post("/register", user.createUser);
router.post("/posts", authentication.verifyToken, user.loginPost);
router.post("/login", user.loginUser);

module.exports = router;
