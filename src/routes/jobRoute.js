const express = require("express")
const router = express.Router();
const { createJob, getAllJobs } = require("../controllers/jobController");
const auth = require("../middlewares/auth")

router.post("/create", auth, createJob)
router.get("/getJobs", auth, getAllJobs)

module.exports = router;