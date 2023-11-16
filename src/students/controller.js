// import db
const pool = require("../../db");
// import queries
const queries = require("./queries");

// get all students
const getStudents = (req, res) => {
  pool.query(queries.getStudents, (error, results) => {
    if (error) throw error;
    res.status(200).json(results.rows);
  });
};

// get student by id
const getStudent = (req, res) => {
  const id = parseInt(req.params.id);
  pool.query(queries.getStudent, [id], (error, results) => {
    if (error) throw error;
    res.status(200).json(results.rows);
  });
};

// post student
const postStudent = (req, res) => {
  const { name, email, age, dob } = req.body;
  pool.query(queries.checkEmail, [email], (error, results) => {
    if (results.rows.length) {
      res.send("Email already exists.");
    }
    pool.query(
      queries.postStudent,
      [name, email, age, dob],
      (error, results) => {
        if (error) throw error;
        res.status(201).send("Student created successfully!");
      }
    );
  });
};

// delete student
const deleteStudent = (req, res) => {
  const id = parseInt(req.params.id);
  pool.query(queries.getStudent, [id], (error, results) => {
    const noStudentIdFound = !results.rows.length;
    if (noStudentIdFound) {
      res.send("Student does not exists!");
    } else {
      pool.query(queries.deleteStudent, [id], (error, results) => {
        if (error) throw error;
        res.status(200).send("Student removed successfully!");
      });
    }
  });
};

// put/update student
const updateStudent = (req, res) => {
  const id = parseInt(req.params.id);
  const { name } = req.body;
  pool.query(queries.getStudent, [id], (error, results) => {
    const noStudentIdFound = !results.rows.length;
    if (noStudentIdFound) {
      res.send("Student does not exists!");
    } else {
      pool.query(queries.updateStudent, [name, id], (error, results) => {
        if (error) throw error;
        res.status(200).send("Student updated successfully!");
      });
    }
  });
};

module.exports = {
  getStudents,
  getStudent,
  postStudent,
  updateStudent,
  deleteStudent,
};
