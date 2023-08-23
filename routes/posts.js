const express = require("express")
const PostController = require("../controllers/PostController")
const router = express.Router()

router.post("/create",PostController.create)
router.delete("/delete/:_id",PostController.deletePost)
router.put("/update/:_id", PostController.updatePost)
router.get("/byId/:_id", PostController.getPostById)
router.get('/all',PostController.getPosts)

module.exports = router