const userModel = require("../model/userSchema");
const emailValidator = require("email-validator");
const bcrypt=require('bcrypt')
const jwt = require("jsonwebtoken");

const signup = async (req, res) => {
  const { name, email, password, confirmpassword } = req.body;
  console.log(name, email, password, confirmpassword);
  if (!name || !email || !password || !confirmpassword) {
    return res.status(400).json({
      success: false,
      message: "Every field is required",
    });
  }
  const validEmail = emailValidator.validate(email);
  if (!validEmail) {
    return res.status(400).json({
      success: false,
      message: "Provide a valid email id",
    });
  }
  if (password !== confirmpassword) {
    return res.status(400).json({
      success: false,
      message: "Password and confirm password do not match",
    });
  }
  try {
    const userInfo = userModel(req.body);
    const result = await userInfo.save();
    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (e) {
    if (e.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Account already exists with the provided email id",
      });
    }
    return res.status(400).json({
      success: false,
      message: e.message,
    });
  }
};

const signin = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Every field is mandatory",
    });
  }
  try {
    const user = await userModel.findOne({ email }).select("+password");
    if (!user ||!(await  bcrypt.compare(password , user.password)) ){
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = user.jwtToken();

    user.password = undefined;

    const cookieOption = {
      maxAge: 24 * 60 * 60 * 1000,
      httpOnly: true,
    };
    res.cookie("token", token, cookieOption);

    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (e) {
    return res.status(400).json({
      success: false,
      message: e.message,
    });
  }
};

const getUser = async (req, res) => {
  const userId = req.user.id;
  try {
    const user = await userModel.findById(userId);
    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (e) {
    return res.status(400).json({
      success: false,
      message: e.message,
    });
  }
};

const logout = (req, res) => {
  try {
    const cookieOption = {
      expires: new Date(),
      httpOnly: true,
    };
    res.cookie("token", null, cookieOption);
    return res.status(200).json({
      success: true,
      message: "Logged Out",
    });
  } catch (e) {
    return res.status(400).json({
      success: false,
      message: e.message,
    });
  }
};

module.exports = {
  signup,
  signin,
  getUser,
  logout,
};
