import jwt from "jsonwebtoken";

export const sendToken = (user, res, message, statusCode) => {
  //! Create the token for the user
  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET_KEY);

  //! Passed that jwt token into the cookie

  res.cookie("token", token, {
    expires: new Date(Date.now() + 60 * 1000),
    httpOnly: true,
    sameSite: process.env.NODE_ENV === "Development" ? "lax" : "none",
    secure: process.env.NODE_ENV === "Development" ? false : true,
  });

  // return res.redirect("/");
  res.status(statusCode).json({
    success: "true",
    message: message,
    user,
  });
};
