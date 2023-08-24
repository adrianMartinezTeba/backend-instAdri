const express = require("express")
const PostController = require("../controllers/PostController")
const router = express.Router()
const upload = require('../middlewares/multer'); 

router.post("/create", upload.single('img'),PostController.create)
router.delete("/delete/:_id",PostController.deletePost)
router.put("/update/:_id", PostController.updatePost)
router.get("/byId/:_id", PostController.getPostById)
router.get('/all',PostController.getPosts)

module.exports = router