const express = require("express")
const PostController = require("../controllers/PostController")
const router = express.Router()
const upload = require('../middlewares/multer'); 
const { authentication } = require("../middlewares/authentication");

router.post("/create", authentication,upload.single('image'),PostController.create)
router.delete("/delete/:_id",PostController.deletePost)
router.put("/update/:_id", PostController.updatePost)
router.post("/like/:_id",authentication, PostController.likePost)
router.delete("/unLike/:_id",authentication, PostController.deleteLike)
router.get("/byId/:_id", PostController.getPostById)
router.get('/all',PostController.getPosts)

module.exports = router