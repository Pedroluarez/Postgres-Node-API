"use strict";

const Router = require("express");
const router = Router(); 
const authentication = require("../middleware/auth");
const connectionStatus = require("../controllers/connectionStatus");   

/**
 * @swagger
 * paths:
 *  /status:
 *      get:
 *          summary: Check summary
 *          description: check desc
 *          responses:
 *              200:
 *                  description: check desc
 *              500:
 *                  description: check desc
 */


// router.get("/status",(req,res)=>{
//     res.send("test apis")
// });
router.get("/status",authentication.validateApp, connectionStatus.getStatus);
router.use("/users", require("./users"));
router.use("/students", require("./students"));

module.exports = router;
