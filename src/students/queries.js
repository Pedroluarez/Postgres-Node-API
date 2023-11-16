const getStudents = `SELECT * FROM students`;
const getStudent = `SELECT * FROM students WHERE id = $1`;
const checkEmail = `SELECT s FROM students s WHERE s.email = $1`;
const postStudent = `INSERT INTO students (name,email,age,dob) VALUES ($1,$2,$3,$4)`;
const updateStudent = `UPDATE students SET name = $1 WHERE id = $2;`;
const deleteStudent = `DELETE FROM students WHERE id = $1`;

module.exports = {
  getStudents,
  getStudent,
  checkEmail,
  postStudent,
  deleteStudent,
  updateStudent,
};
