const UserModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const {
  isValid,
  isValidObjectId,
  isValidName,
  isValidEmail,
  isValidMobile,
  isValidPassword,
} = require("../utils/validator");

//Register User
const createUser = async (req, res) => {
  try {
    let userData = req.body;

    if (!userData || Object.keys(userData).length === 0) {
      return res.status(400).json({ msg: " Bad Request! No Data Provided" });
    }

    let { fullName, email, password, mobile } = userData;

    //FullName Validation
    if (!isValid(fullName)) {
      return res.status(400).json({ msg: "Full Name is Required" });
    }
    if (!isValidName(fullName)) {
      return res.status(400).json({ msg: "Invalid Name" });
    }

    //Email Validation
    if (!isValid(email)) {
      return res.status(400).json({ msg: "Email is Required" });
    }
    if (!isValidEmail(email)) {
      return res.status(400).json({ msg: "Invalid Email" });
    }

    let emailExist = await UserModel.findOne({ email });
    if (emailExist) {
      return res.status(400).json({ msg: "Email Already Exists" });
    }

    //Contact Validation
    if (!isValid(mobile)) {
      return res.status(400).json({ msg: "Conatct is Required" });
    }
    if (!isValidMobile(mobile)) {
      return res.status(400).json({ msg: "Invalid Conatct" });
    }

    let mobileNoExist = await UserModel.findOne({ mobile });
    if (mobileNoExist) {
      return res.status(400).json({ msg: "Conatct Already Exists" });
    }

    //Password Validation
    if (!isValid(password)) {
      return res.status(400).json({ msg: "Password is Required" });
    }
    if (!isValidPassword(password)) {
      return res.status(400).json({
        msg: "Password must be 8-20 chars with Uppercase, LowerCase,numbes and Special Characters",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    userData.password = hashedPassword;

    let addedUser = await UserModel.create(userData);

    return res.status(201).json({ msg: "User Added SuccessFully", addedUser });
  } catch (error) {
    return res.status(500).json({ msg: "internal Server Error" });
  }
};

//Login User // Authentication
const loginUser = async (req, res) => {
  try {
    let userData = req.body;

    if (!userData || Object.keys(userData).length === 0) {
      return res.status(400).json({ msg: " Bad Request! No Data Provided" });
    }

    let { email, password } = userData;
    //Email Validation
    if (!isValid(email)) {
      return res.status(400).json({ msg: "Email is Required" });
    }
    if (!isValidEmail(email)) {
      return res.status(400).json({ msg: "Invalid Email" });
    }

    let user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ msg: "Email is not Registered!!" });
    }

    //Password Validation
    if (!isValid(password)) {
      return res.status(400).json({ msg: "Password is Required" });
    }
    if (!isValidPassword(password)) {
      return res.status(400).json({
        msg: "Password must be 8-20 chars with Uppercase, LowerCase,numbes and Special Characters.",
      });
    }

    let passwordCheck = await bcrypt.compare(password, user.password);
    if (!passwordCheck) {
      return res.status(400).json({ msg: "Incorrect Password" });
    }

    let token = jwt.sign(
      {
        userId: user._id,
      },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "1d",
      },
    );

    return res.status(200).json({ msg: "Login Successful ", token });
  } catch (error) {
    return res.status(500).json({ msg: "internal Server Error" });
  }
};

//Get My Profile
const getProfile = async (req, res) => {
  try {
    let userId = req.userId;

    let user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: "User Not Found" });
    }

    return res.status(200).json({ msg: "Profile Fetched Successfully", user });
  } catch (error) {
    console.log(error);

    return res.status(500).json({ msg: " Internal Server Error" });
  }
};

// Delete User
const deleteUser = async (req, res) => {
  try {
    let userId = req.userId;
    let deleteUser = await UserModel.findByIdAndDelete(userId);

    if (!deleteUser) {
      return res
        .status(404)
        .json({ msg: " User Not Found or Already Deleted" });
    }
    return res.status(200).json({ msg: " User Deleted Successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: " Internal Server Error" });
  }
};
//Update Profile
const updateProfile = async (req, res) => {
  try {
    let userId = req.userId;
    let userData = req.body;

    if (!userData || Object.keys(userData).length === 0) {
      return res.status(400).json({ msg: "Bad Request , No Data Provided" });
    }

    let { fullName, email, password, mobile } = userData;

    let = updatedData = {};
    //FullName Validation in Update
    if (fullName !== undefined) {
      if (!isValid(fullName)) {
        return res.status(400).json({ msg: "Full Name is Required" });
      }
      if (!isValidName(fullName)) {
        return res.status(400).json({ msg: "Invalid Name" });
      }
      updatedData.fullName = fullName;
    }

    //Email Validation in Update
    if (email !== undefined) {
      if (!isValid(email)) {
        return res.status(400).json({ msg: "Email is Required" });
      }
      if (!isValidEmail(email)) {
        return res.status(400).json({ msg: "Invalid Email" });
      }

      let emailExist = await UserModel.findOne({ email, _id: { $ne: userId } });
      if (emailExist) {
        return res.status(400).json({ msg: "Email Already Exists" });
      }
      updatedData.email = email;
    }

    //Password Validation in Update
    if (password !== undefined) {
      if (!isValid(password)) {
        return res.status(400).json({ msg: "Password is Required" });
      }
      if (!isValidPassword(password)) {
        return res.status(400).json({
          msg: "Password must be 8-20 chars with Uppercase, LowerCase,numbes and Special Characters",
        });
      }

      updatedData.password = await bcrypt.hash(password, 10);
    }
    //Mobile Validation in Update
    if (mobile !== undefined) {
      if (!isValid(mobile)) {
        return res.status(400).json({ msg: "Conatct is Required" });
      }
      if (!isValidMobile(mobile)) {
        return res.status(400).json({ msg: "Invalid Conatct" });
      }

      const mobileNoExist = await UserModel.findOne({
        mobile,
        _id: { $ne: userId },
      });
      if (mobileNoExist) {
        return res.status(400).json({ msg: "Conatct Already Exists" });
      }

      updatedData.mobile = mobile;
    }

    let update = await UserModel.findByIdAndUpdate(userId, userData, {
      new: true,
    });
    if (!update) {
      return res.status(404).json({ msg: "User Not Found" });
    }

    return res
      .status(200)
      .json({ msg: "Profile Updated Successfully", updatedData });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: " Internal Server Error" });
  }
};

module.exports = {
  createUser,
  loginUser,
  getProfile,
  deleteUser,
  updateProfile,
};
