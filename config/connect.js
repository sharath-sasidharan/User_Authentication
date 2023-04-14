import mongoose from "mongoose";

export const connectDB = () => {
  mongoose
    .connect(process.env.MONGO_URI, {
      dbName: "user-authentication",
    })
    .then(() => {
      console.log("Connected to MongoDB");
    })
    .catch(() => {
      console.log("Failed to connect to MongoDB");
    });
};
