import express from "express";
import userRouter from "./Routes/user.js";
import taskRouter from "./Routes/task.js";
import { config } from "dotenv";
import cookieParser from "cookie-parser";
import { errorMiddleWare } from "./middlewares/error.js";
import cors from "cors";
// import path from "path";

export const app = express();

//! DotENV setup
config({
  path: "./config/data.env",
});

app.use(express.urlencoded({ extended: true }));

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: [process.env.FRONTEND_URL],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

//! Setting up static files
// app.use(express.static(path.join(path.resolve(), "public")));

//! Import Router Middlewares
app.use("/api/v1/users", userRouter);
app.use("/api/v1/task", taskRouter);

//! Using Error Middleware
app.use(errorMiddleWare);
