import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/user.js";

import {
  registerUser,
  loginUser,
  logoutUser,
  HomePage,
  loginPage,
  registerPage,
  getAllUsers,
  getUser,
  DeleteUser,
  updateUser,
} from "../controllers/user.js";
const router = express.Router();

//! isAuthenticated function middleware verifying user
const isAuthenticated = async (req, res, next) => {
  const { token } = req.cookies;

  if (token) {
    const decoded = jwt.verify(token, "secret-key");
    req.user = await User.findById(decoded._id);
    next();
  } else {
    return res.json({
      message: "Please Login first",
    });
  }
};

//! render logout page which is authenticated that means cookies are available
router.get("/", isAuthenticated, HomePage);

//! Login the login page
router.get("/login", loginPage);

//! Render the register page
router.get("/register", registerPage);

//! Login the user
router.post("/login", loginUser);

//! Register the user
router.post("/register", registerUser);

//!Get All Users
router.get("/get-users", getAllUsers);

//! Get user by id
router
  .route("/get-users/:id")
  .get(isAuthenticated, getUser)
  .put(isAuthenticated, updateUser)
  .delete(isAuthenticated, DeleteUser);

//! Logout
router.get("/logout", logoutUser);

export default router;
