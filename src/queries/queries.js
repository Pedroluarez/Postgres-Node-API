"use strict";

module.exports = {
  getStudents: `SELECT getAllStudents()`,
  getStudentsWithPagination: `SELECT * FROM students LIMIT $1 OFFSET $2`,
  getStudent: `SELECT getStudentById($1)`,
  checkEmail: `SELECT checkStudentEmail($1)`,
  checkName: `SELECT checkName($1)`,
  postStudent: `SELECT postStudent($1,$2,$3,$4,$5)`,
  updateStudent: `select putStudent($1,$2)`,
  deleteStudent: `select deleteStudent($1)`,
}; 