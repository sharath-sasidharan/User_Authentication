import mongoose from "mongoose";

export const connectDB = () => {
  mongoose
    .connect(process.env.MONGO_URI, {
      dbName: "user-authentication",
    })
    .then((c) => {
      console.log(`Database connected with ${c.connection.host}`);
    })
    .catch(() => {
      console.log("Failed to connect to MongoDB");
    });
};
