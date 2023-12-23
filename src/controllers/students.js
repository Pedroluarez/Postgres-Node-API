"use strict";

const pg = require("pg");
const config = require("../../config");
const pool = new pg.Pool(config.database);
const queries = require("../queries/queries");

module.exports = {
  // get all students
  getStudents: async (req, res) => {
    try {
      const queryResult = await pool.query(queries.getStudents);
      if (!queryResult) return error;
      res.status(200).json({
        result: "Success",
        studentsData: queryResult.rows,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getStudentsWithPagination: async (req, res) => {
    try {
      const page = parseInt(req.query.page);
      const limit = parseInt(req.query.limit);
      const offset = (page - 1) * limit;

      const result = await pool.query(queries.getStudentsWithPagination, [
        limit,
        offset,
      ]);
      res.status(200).json({
        result: "Success",
        studentsData: result.rows,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // get student by id
  getStudent: async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const queryResult = await pool.query(queries.getStudent, [id]);
      const noStudentIdFound = !queryResult.rows.length;
      if (noStudentIdFound)
        return res.status(400).json({
          result: "Failed",
          message: "Invalid request or student does not exists",
        });

      if (!queryResult) return error;
      res.status(200).json({
        result: "Success",
        studentData: queryResult.rows,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // post student
  postStudent: async (req, res) => {
    try {
      const { name, email, age, dob, password } = req.body;
      const checkEmailResult = await pool.query(queries.checkEmail, [email]);
      const isEmptyRequestBody =
        !req.body || Object.keys(req.body).length === 0;
      const isEmailUsed = checkEmailResult.rows.length;
      if (isEmptyRequestBody)
        return res.status(400).json({
          result: "Failed",
          message: "Invalid or empty request",
        });
      if (isEmailUsed)
        return res
          .status(400)
          .json({ result: "Failed", message: "Email already used!" });

      const queryResult = pool.query(queries.postStudent, [
        name,
        email,
        age,
        dob,
        password,
      ]);
      if (!queryResult) return error;
      res.status(200).json({
        result: "Success",
        message: "Student created successfully!",
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // delete student
  deleteStudent: async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const checkStudent = await pool.query(queries.getStudent, [id]);
      const noStudentIdFound = !checkStudent.rows.length;
      if (noStudentIdFound)
        return res.status(400).json({
          result: "Failed",
          message: "Student does not exists!",
        });
      const queryResult = await pool.query(queries.deleteStudent, [id]);
      if (!queryResult) return error;
      res.status(200).json({
        result: "Success",
        message: "Student removed successfully!",
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // put/update student
  updateStudent: async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { name } = req.body;
      const checkStudent = await pool.query(queries.getStudent, [id]);
      const isEmptyRequestBody =
        !req.body || Object.keys(req.body).length === 0;
      const noStudentIdFound = !checkStudent.rows.length;
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
      const queryResult = await pool.query(queries.updateStudent, [name, id]);
      if (!queryResult) return error;
      res.status(200).json({
        result: "Success",
        message: "Student updated successfully!",
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};
