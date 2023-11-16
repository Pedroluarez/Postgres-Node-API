const Router = require("express");
// import controller
const controller = require("./controller");

const router = Router();

// routers
router.get("/", controller.getStudents);
router.get("/:id", controller.getStudent);
router.post("/", controller.postStudent);
router.put("/:id", controller.updateStudent);
router.delete("/:id", controller.deleteStudent);

module.exports = router;
