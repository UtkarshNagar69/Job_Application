const express = require("express");
const router = express.Router();

const { createUser, loginUser, getProfile, deleteUser } = require("../controllers/userController");

const auth = require("../middlewares/auth")

router.post("/register", createUser);
router.post("/login", loginUser);
router.get("/profile", auth, getProfile);
router.delete("/delete", auth, deleteUser);

module.exports = router;
