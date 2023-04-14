import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const HomePage = (req, res) => {
  res.render("logout", { name: req.user.name });
};

export const loginPage = (req, res) => {
  res.render("login");
};

export const registerPage = (req, res) => {
  res.render("register");
};

export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    // //! while register verify the user exist or no, if no will creating the user for the first time  if yes then redirect user to login page
    // if (user) {
    //   return res.redirect("/login");
    // }

    if (user) {
      return res.json({
        message: "User already Exists",
      });
    }

    //! Hash the password before creating the user
    const passwordHash = await bcrypt.hash(password, 10);
    user = await User.create({
      name,
      email,
      password: passwordHash,
    });

    //! Create the token for the user
    const token = jwt.sign({ _id: user._id }, "secret-key");

    //! Passed that jwt token into the cookie
    res.cookie("token", token, {
      expires: new Date(Date.now() + 60 * 1000),
      httpOnly: true,
    });
    // res.render("login");
    res.status(201).json({
      success: true,
      message: "Registered successfully",
      user,
    });
  } catch (err) {
    console.log(err);
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    //! while login verify the user exist or no, if no will redirect user to register if yes then redirect user to home page
    // if (!user) {
    //   return res.redirect("/register");
    // }
    if (!user) {
      return res.json({
        message: "User not found",
      });
    }
    //! Compare the password
    const password_match = await bcrypt.compare(password, user.password);

    //! password does not match
    if (!password_match) {
      return res.render("login", {
        message: "Invalid Credentials",
      });
    }

    //! Create the token for the user
    const token = jwt.sign({ _id: user._id }, "secret-key");

    //! Passed that jwt token into the cookie

    res.cookie("token", token, {
      expires: new Date(Date.now() + 60 * 1000),
      httpOnly: true,
    });

    // return res.redirect("/");
    res.status(200).json({
      success: "true",
      message: "Login Success",
      user,
    });
  } catch (err) {
    console.log(err);
  }
};

export const getAllUsers = async (req, res) => {
  try {
    let users = await User.find();
    res.status(200).json({
      success: "true",
      users,
    });
  } catch (err) {
    console.log(err);
  }
};

export const updateUser = async (req, res) => {
  const { id } = req.params;

  try {
    let users = await User.findById(id);
    if (!users) {
      return res.status(404).json({
        message: "Record not found",
      });
    }
    //! Create the token for the user
    const token = jwt.sign({ _id: users._id }, "secret-key");

    //! Passed that jwt token into the cookie

    res.cookie("token", token, {
      expires: new Date(Date.now() + 60 * 1000),
      httpOnly: true,
    });
    res.status(200).json({
      success: "true",
      users,
      message: "Updated",
    });
  } catch (err) {
    console.log(err);
  }
};

export const DeleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    let users = await User.findById(id);
    if (!users) {
      return res.status(404).json({
        message: "Record not found",
      });
    }
    users.deleteOne();
    //! Create the token for the user
    const token = jwt.sign({ _id: users._id }, "secret-key");

    //! Passed that jwt token into the cookie

    res.cookie("token", token, {
      expires: new Date(Date.now() + 60 * 1000),
      httpOnly: true,
    });
    res.status(200).json({
      success: "true",
      message: "Deleted",
    });
  } catch (err) {
    console.log(err);
  }
};

export const getUser = async (req, res) => {
  const { id } = req.params;

  try {
    let users = await User.findById(id);
    if (!users) {
      return res.status(404).json({
        message: "Record not found",
      });
    }

    //! Create the token for the user
    const token = jwt.sign({ _id: users._id }, "secret-key");

    //! Passed that jwt token into the cookie

    res.cookie("token", token, {
      expires: new Date(Date.now() + 60 * 1000),
      httpOnly: true,
    });
    res.status(200).json({
      success: "true",
      users,
    });
  } catch (err) {
    console.log(err);
  }
};

export const logoutUser = (req, res) => {
  res.cookie("token", null, { expires: new Date(Date.now()) });
  //   res.redirect("/login");
  res.status(200).json({
    message: "Logout Success",
  });
};
