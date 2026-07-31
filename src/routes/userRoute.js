const express = require("express");
const router = express.Router();

const {
  createUser,
  loginUser,
  getProfile,
  deleteUser,
  updateProfile,
} = require("../controllers/userController");

const auth = require("../middlewares/auth");

router.post("/register", createUser);
router.post("/login", loginUser);
router.get("/profile", auth, getProfile);
router.delete("/delete", auth, deleteUser);
router.put("/update", auth, updateProfile);

module.exports = router;
