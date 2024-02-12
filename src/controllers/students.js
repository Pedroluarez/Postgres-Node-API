"use strict";

const pg = require("pg");
const config = require("../../config");
const pool = new pg.Pool(config.database);
const queries = require("../queries/queries");
const axios = require("axios");
const PDFDocument = require("pdfkit");
const fs = require("fs");

module.exports = {
  // get all students
  getStudents: async (req, res) => {
    try {
      const queryResult = await pool.query(queries.getStudents);
      if (!queryResult) return error;
      res.status(200).json({
        result: {
          data: queryResult.rows,
        },
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
      const noStudentIdFound = queryResult.rows[0].getstudentbyid;

      if (noStudentIdFound === null)
        return res.status(400).json({
          result: { message: "Student does not exists!" },
        });
      res.status(200).json({
        result: { data: queryResult.rows },
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
      const isEmailUsed = checkEmailResult.rows[0].checkstudentemail;
      if (isEmptyRequestBody)
        return res.status(400).json({
          result: "Failed",
          message: "Invalid or empty request",
        });

      if (isEmailUsed !== null)
        return res.status(400).json({
          result: {
            message: "Email already used!",
          },
        });
      const queryResult = pool.query(queries.postStudent, [
        name,
        email,
        age,
        dob,
        password,
      ]);
      if (!queryResult) return error;
      res.status(200).json({
        result: {
          message: "Student created successfully!",
        },
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
      const noStudentIdFound = checkStudent.rows[0].getstudentbyid;
      if (noStudentIdFound === null)
        return res.status(400).json({
          result: { message: "Student does not exists!" },
        });

      const queryResult = await pool.query(queries.deleteStudent, [id]);
      if (!queryResult) return error;
      res.status(200).json({
        result: { message: "Student removed successfully!" },
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
      const noStudentIdFound = checkStudent.rows[0].getstudentbyid;
      if (isEmptyRequestBody)
        return res.status(400).json({
          result: { message: "Invalid or empty request" },
        });

      if (noStudentIdFound === null)
        return res.status(400).json({
          result: "Failed",
          message: "Student does not exists!",
        });

      const queryResult = await pool.query(queries.updateStudent, [name, id]);
      if (!queryResult) return error;
      res.status(200).json({
        result: { message: "Student updated successfully!" },
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  exportData: async (req, res) => {
    const studentId = req.params.id;

    if (!studentId || studentId.trim() === "")
      return res.status(400).json({
        result: {
          message: "Id is null or empty",
        },
      });

    const getStudentData = await axios.get(
      `http://localhost:8080/api/v1/students/${studentId}`
    );

    if (!getStudentData)
      return res.status(400).json({
        result: {
          message: error.message,
        },
      });

    const id = getStudentData.data.result.data[0].getstudentbyid.id;
    const name = getStudentData.data.result.data[0].getstudentbyid.name;
    const email = getStudentData.data.result.data[0].getstudentbyid.email;
    const age = getStudentData.data.result.data[0].getstudentbyid.age;
    const dob = getStudentData.data.result.data[0].getstudentbyid.dob;

    const doc = new PDFDocument();
    const fileName = `student_record_${studentId}_${Date.now()}.pdf`;
    const stream = fs.createWriteStream(fileName);

    doc.pipe(stream);
    doc
      .fontSize(14)
      .text("student record Record", { align: "center" })
      .moveDown(0.5);
    doc.fontSize(12).text(`id: ${id}`);
    doc.fontSize(12).text(`name: ${name}`);
    doc.fontSize(12).text(`email: ${email}`);
    doc.fontSize(12).text(`age: ${age}`);
    doc.fontSize(12).text(`dob: ${dob}`);

    doc.end();

    res.status(200).json({
      result: {
        message: "pdf generate successfully",
        fileName: `${fileName}`
      },
    }); 
  },
};
