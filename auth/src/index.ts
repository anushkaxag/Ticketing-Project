import mongoose from "mongoose";

import { app } from "./app";

// Connecting Node.js to MongoDB instance - which is in a pod
// We use clustreIP Service to reach a pod
// Url inside mongoose.connect is the name of the service
const start = async () => {
  // Checking if env variable is defined
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY must be defined");
  }
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI must be defined");
  }
  // Write name of service, than the port, than the db name
  // DataBase, will be created automatically - auth named
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error(err);
  }

  app.listen(3000, () => {
    console.log("Listening on port 3000!");
  });
};

start();
