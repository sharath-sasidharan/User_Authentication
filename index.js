import express from "express";
import UserRoute from "./Routes/user.js";
import path from "path";
import { connectDB } from "./config/connect.js";
import User from "./models/user.js";

//! Database connection
connectDB();
const app = express();

//! Setting up view engine
app.set("view engine", "ejs");

//! Setting up static files
app.use(express.static(path.join(path.resolve(), "public")));
// console.log("==", path.join(path.resolve(), "public"));

//! To access values from form we need to use middleware
// app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//! Import Router Middlewares
// app.use("/api/user", UserRoute);

app.get("/", (req, res) => {
  // res.send("hello world!😎");
  // console.log(user);
  // users.push(user);
  // res.sendFile(path.join(path.resolve(), "./public/index.html"));

  // res.json({
  //   success: true,
  //   users: user,
  // });
  res.render("index");
});

app.post("/", async (req, res) => {
  const { name, email } = req.body;
  try {
    const users = await User.create({
      name,
      email,
    });
    res.json({
      users,
    });
  } catch (err) {
    console.log(err);
  }
});

app.listen(5000, () => {
  console.log("listening on port on 5000");
});
