"use strict";

const Router = require("express");
const router = Router();
// import controller
const studentsController = require("../controllers/studentsController");

// routers
router.get("/", studentsController.getStudents);
router.get("/:id", studentsController.getStudent);
router.post("/", studentsController.postStudent);
router.put("/:id", studentsController.updateStudent);
router.delete("/:id", studentsController.deleteStudent);

module.exports = router;
