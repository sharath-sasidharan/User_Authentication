import express from "express";
import userRouter from "./Routes/user.js";
import path from "path";
import { connectDB } from "./config/connect.js";
import cookieParser from "cookie-parser";
import { config } from "dotenv";
import taskRouter from "./Routes/task.js";
import { errorMiddleWare } from "./middlewares/error.js";
import cors from "cors";
//! DotENV setup
config({
  path: "./config/data.env",
});

//! Database connection
connectDB();
const app = express();

app.use(
  cors({
    origin: [process.env.FRONTEND_URL],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
//! Setting up cookieParser
app.use(cookieParser());
//! Setting up view engine
app.set("view engine", "ejs");

//! Setting up static files
app.use(express.static(path.join(path.resolve(), "public")));

//! To access values from form we need to use middleware
// app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.json());

//! Import Router Middlewares
app.use("/api/v1/users", userRouter);
app.use("/api/v1/task", taskRouter);

//! Using Error Middleware
app.use(errorMiddleWare);

app.listen(process.env.PORT, () => {
  console.log(
    `Server Running on port ${process.env.PORT} in ${process.env.NODE_ENV} mode`
  );
});
