const express = require("express")
const PostController = require("../controllers/PostController")
const router = express.Router()

router.post("/create",PostController.createRoutine)
router.delete("/delete/:_id",PostController.deleteRoutine)
router.put("/update/:_id", PostController.updateRoutine)
router.get("/byId/:_id", PostController.getRoutineById)
router.get('/all',PostController.getRoutines)

module.exports = router