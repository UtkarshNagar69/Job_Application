const { isValidObjectId } = require("mongoose");
const jobModel = require("../models/jobModel");
const { isValid } = require("../utils/validator");

//Create Job
const createJob = async (req, res) => {
  try {
    let jobData = req.body;

    if (!jobData || Object.keys(jobData).length === 0) {
      return res.status(400).json({ msg: "Bad Request! No Data Provided" });
    }

    let {
      jobTitle,
      companyName,
      location,
      salary,
      jobType,
      status,
      description,
    } = jobData;

    if (!isValid(jobTitle)) {
      return res.status(400).json({ msg: "Job Title is Required" });
    }

    if (!isValid(companyName)) {
      return res.status(400).json({ msg: "Company Name is Required" });
    }

    if (!isValid(location)) {
      return res.status(400).json({ msg: "Location is Required" });
    }

    if (!isValid(salary)) {
      return res.status(404).json({ msg: "Salary is Required" });
    }

    if (!isValid(jobType)) {
      return res.status(404).json({ msg: "Job Type is Required" });
    }

    if (!["Full Time", "Part Time", "Remote", "Internship"].includes(jobType)) {
      return res.status(400).json({ msg: "Invalid Job Types" });
    }

    if (status !== undefined) {
      if (!["Applied", "Interview", "Selected", "Rejected"].includes(status)) {
        return res.status(400).json({ msg: "Invalid Job Status" });
      }
    }

    if (!isValid(description)) {
      return res.status(400).json({ msg: "Job Description is Required" });
    }

    jobData.userId = req.userId;

    let addedJob = await jobModel.create(jobData);

    return res.status(201).json({ msg: "Job Added Successfully", addedJob });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

//Get All Jobs
const getAllJobs = async (req, res) => {
  try {
    let jobs = await jobModel.find({ userId: req.userId });

    if (jobs.length === 0) {
      return res.status(404).json({ msg: "No Jobs Found" });
    }

    return res.status(200).json({
      msg: "Job Fetched Successfully",
      totalJobs: jobs.length,
      data: jobs,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

//Get Specific Job
const getJobById = async (req, res) => {
  try {
    let id = req.params.id;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ msg: "Invalid Id" });
    }

    let job = await jobModel.findOne({
      _id: id,
      userId: req.userId,
    });

    if (!job) {
      return res.status(404).json({ msg: " Job Not Found " });
    }

    return res.status(200).json({ job });
  } catch (error) {
    return res.status(500).json({ msg: "Internal Server Errors" });
  }
};

//Delete Job
const deleteJob = async (req, res) => {
  try {
    let id = req.params.id;
    await jobModel.findByIdAndDelete(id);
    return res.status(200).json({ msg: "Job Deleted Successfully" });
  } catch (error) {
    console.log(error);

    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

//Update Job


module.exports = { createJob, getAllJobs, getJobById, deleteJob };
