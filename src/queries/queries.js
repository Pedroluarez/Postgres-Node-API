"use strict";

module.exports = {
  getStudents: `SELECT * FROM students`,
  getStudent: `SELECT * FROM students WHERE id = $1`,
  checkEmail: `SELECT s FROM students s WHERE s.email = $1`,
  postStudent: `INSERT INTO students (name,email,age,dob) VALUES ($1,$2,$3,$4)`,
  updateStudent: `UPDATE students SET name = $1 WHERE id = $2;`,
  deleteStudent: `DELETE FROM students WHERE id = $1`,
};
