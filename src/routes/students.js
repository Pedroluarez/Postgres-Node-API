"use strict";

const Router = require("express");
const router = Router();

const students = require("../controllers/students");

// routers
router.get("/", students.getStudents);
router.get("/:id", students.getStudent);
router.post("/", students.postStudent);
router.put("/:id", students.updateStudent);
router.delete("/:id", students.deleteStudent);

module.exports = router;
