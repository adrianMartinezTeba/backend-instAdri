const express = require("express");
const UserController = require("../controllers/UserController");
const router = express.Router();
const { authentication } = require("../middlewares/authentication")
const upload = require('../middlewares/multer'); 

router.post("/register",upload.single('profileImage'), UserController.register);
router.get("/confirmRegister/:emailToken", UserController.confirm);
router.get("/all", UserController.getUsers);
router.post("/login", UserController.login);
router.delete("/logout",authentication, UserController.logout);
router.get("/userInfo", authentication,UserController.getInfoById);
router.get('/recoverPassword/:email', UserController.recoverPassword);
router.put("/resetPassword/:recoverToken", UserController.resetPassword);

module.exports = router;
