"use strict";

const Router = require("express");
const router = Router();

const students = require("../controllers/students");
const authentication = require("../middleware/auth");

// routers
router.get("/all", authentication.validateLimit, authentication.validateApp, students.getStudents);
router.get("/", authentication.validateLimit, authentication.validateApp, authentication.appPagination, students.getStudentsWithPagination);
router.get("/:id", students.getStudent);
router.post("/", students.postStudent);
router.put("/:id", students.updateStudent);
router.delete("/:id", students.deleteStudent);

module.exports = router;
