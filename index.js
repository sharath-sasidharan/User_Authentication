import express from "express";
import UserRoute from "./Routes/user.js";
import path from "path";

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

app.post("/", (req, res) => {
  console.log(req.body);

  res.json({
    users: [
      {
        name: req.body.name,
        email: req.body.email,
      },
    ],
  });
});

app.listen(5000, () => {
  console.log("listening on port on 5000");
});
