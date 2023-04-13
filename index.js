import express from "express";
import UserRoute from "./Routes/user.js";
import path from "path";
import { connectDB } from "./config/connect.js";
import User from "./models/user.js";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
//! Database connection
connectDB();
const app = express();

//! Setting up cookieParser
app.use(cookieParser());
//! Setting up view engine
app.set("view engine", "ejs");

//! Setting up static files
app.use(express.static(path.join(path.resolve(), "public")));

//! To access values from form we need to use middleware
// app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//! Import Router Middlewares
// app.use("/api/user", UserRoute);

//! isAuthenticated function middleware verifying user
const isAuthenticated = async (req, res, next) => {
  const { token } = req.cookies;

  if (token) {
    const decoded = jwt.verify(token, "secret-key");
    req.user = await User.findById(decoded._id);
    next();
  } else {
    res.redirect("/login");
  }
};

//! render logout page which is authenticated that means cookies are available
app.get("/", isAuthenticated, (req, res) => {
  res.render("logout", { name: req.user.name });
});

//! Login the login page
app.get("/login", (req, res) => {
  res.render("login");
});

//! Render the register page
app.get("/register", (req, res) => {
  res.render("register");
});

//! Login the user
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    //! while login verify the user exist or no, if no will redirect user to register if yes then redirect user to home page
    if (!user) {
      return res.redirect("/register");
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

    return res.redirect("/");
  } catch (err) {
    console.log(err);
  }
});

//! Register the user
app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    //! while register verify the user exist or no, if no will creating the user for the first time  if yes then redirect user to login page
    if (user) {
      return res.redirect("/login");
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
    res.render("login");
  } catch (err) {
    console.log(err);
  }
});

//! Logout
app.get("/logout", (req, res) => {
  res.cookie("token", null, { expires: new Date(Date.now()) });
  res.redirect("/login");
});

app.listen(5000, () => {
  console.log("listening on port on 5000");
});
