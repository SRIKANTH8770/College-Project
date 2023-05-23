const { createUser, verify, login, profile, forgetPassword, resetPassword } = require("../controllers/user");
const { isAuth } = require("../middeware/isAuth");

const router = require("express").Router();


router.post("/create", createUser);
router.post("/verify", verify);
router.post("/login", login);
router.get("/me",isAuth, profile);
router.post("/forget",forgetPassword);
router.post("/reset",resetPassword);

module.exports = router;