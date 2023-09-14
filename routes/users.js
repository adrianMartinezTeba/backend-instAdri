const express = require("express");
const UserController = require("../controllers/UserController");
const router = express.Router();
const { authentication } = require("../middlewares/authentication")
const upload = require('../middlewares/multer'); 

router.post("/register",upload.single('profileImage'), UserController.register);
router.post("/login", UserController.login);
router.get("/confirmRegister/:emailToken", UserController.confirm);
router.get("/all", UserController.getUsers);
router.get('/recoverPassword/:email', UserController.recoverPassword);
router.get("/userLog", authentication,UserController.getInfoById);
router.get("/user/:_id", UserController.getUserById);
router.get('/byName/:name', UserController.searchByName);
router.get('/isFollowing/:_id',authentication, UserController.checkIfFollows);
router.post("/follow/:_id",authentication, UserController.followUser);
router.put("/resetPassword/:recoverToken", UserController.resetPassword);
router.delete('/unfollow/:_id',authentication, UserController.unFollow);
router.delete("/logout",authentication, UserController.logout);

module.exports = router;
