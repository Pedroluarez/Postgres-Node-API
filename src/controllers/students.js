"use strict";

const pg = require("pg");
const config = require("../../config");
const pool = new pg.Pool(config.database);
const queries = require("../queries/queries");

module.exports = {
  // get all students
  getStudents: (req, res) => {
    try {
      pool.query(queries.getStudents, (error, results) => {
        if (error) return error;
        res.status(200).json({
          result: "Success",
          studentsData: results.rows,
        });
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // get student by id
  getStudent: (req, res) => {
    try {
      const id = parseInt(req.params.id);
      pool.query(queries.getStudent, [id], async (error, results) => {
        const noStudentIdFound = !results.rows.length;
        if (noStudentIdFound)
          return res.status(400).json({
            result: "Failed",
            message: "Invalid request or student does not exists",
          });
        await res.status(200).json({
          result: "Success",
          studentData: results.rows,
        });
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // post student
  postStudent: (req, res) => {
    try {
      const { name, email, age, dob, password } = req.body;
      pool.query(queries.checkEmail, [email], async (error, results) => {
        const isEmptyRequestBody =
          !req.body || Object.keys(req.body).length === 0;
        const isEmailUsed = results.rows.length;
        if (isEmptyRequestBody)
          return res.status(400).json({
            result: "Failed",
            message: "Invalid or empty request",
          });
        if (isEmailUsed)
          return res
            .status(400)
            .json({ result: "Failed", message: "Email already used!" });
        await pool.query(
          queries.postStudent,
          [name, email, age, dob, password],
          (error, results) => {
            if (error) return error;
            res.status(200).json({
              result: "Success",
              message: "Student created successfully!",
            });
          }
        );
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // delete student
  deleteStudent: (req, res) => {
    try {
      const id = parseInt(req.params.id);
      pool.query(queries.getStudent, [id], async (error, results) => {
        const noStudentIdFound = !results.rows.length;
        if (noStudentIdFound)
          return res.status(400).json({
            result: "Failed",
            message: "Student does not exists!",
          });
        await pool.query(queries.deleteStudent, [id], (error, results) => {
          if (error) return error;
          res.status(200).json({
            result: "Success",
            message: "Student removed successfully!",
          });
        });
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // put/update student
  updateStudent: (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { name } = req.body;
      pool.query(queries.getStudent, [id], async (error, results) => {
        const isEmptyRequestBody =
          !req.body || Object.keys(req.body).length === 0;
        const noStudentIdFound = !results.rows.length;
        if (isEmptyRequestBody)
          return res.status(400).json({
            result: "Failed",
            message: "Invalid or empty request",
          });
        if (noStudentIdFound)
          return res.status(400).json({
            result: "Failed",
            message: "Student does not exists!",
          });
        await pool.query(queries.updateStudent, [name, id], (error, results) => {
          if (error) return error;
          res.status(200).json({
            result: "Success",
            message: "Student updated successfully!",
          });
        });
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};
