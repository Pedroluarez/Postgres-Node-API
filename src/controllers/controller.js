// import db
const pool = require("../../db");
// import queries
const queries = require("../queries/queries");

// get all students
const getStudents = (req, res) => {
  try {
    pool.query(queries.getStudents, (error, results) => {
      if (error) throw error;
      res.status(200).json(results.rows);
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// get student by id
const getStudent = (req, res) => {
  try {
    const id = parseInt(req.params.id);
    pool.query(queries.getStudent, [id], (error, results) => {
      if (!results.rows.length) {
        res.send("Student is not exists!");
      } else {
        res.status(200).json(results.rows);
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// post student
const postStudent = (req, res) => {
  try {
    const { name, email, age, dob } = req.body;
    pool.query(queries.checkEmail, [email], (error, results) => {
      if (results.rows.length) {
        res.send("Email already exists.");
      } else {
        pool.query(
          queries.postStudent,
          [name, email, age, dob],
          (error, results) => {
            if (error) throw error;
            res.status(201).send("Student created successfully!");
          }
        );
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// delete student
const deleteStudent = (req, res) => {
  try {
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
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
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
