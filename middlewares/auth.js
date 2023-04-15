import jwt from "jsonwebtoken";
import User from "../models/user.js";

//! isAuthenticated function middleware verifying user
export const isAuthenticated = async (req, res, next) => {
  const { token } = req.cookies;
  try {
    if (!token) return next(new ErrorHandler("Please Login first", 404));
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = await User.findById(decoded._id);
    next();
  } catch (err) {
    next(err);
  }
};
