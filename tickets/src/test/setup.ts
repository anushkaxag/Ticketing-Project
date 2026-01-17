import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import request from "supertest";
import { app } from "../app";
import jwt from "jsonwebtoken";

declare global {
  var signin: () => string[];
}

let mongo: any;
// Hook that will run before all the tests start to be executed
beforeAll(async () => {
  process.env.JWT_KEY = "asdfasdf";
  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();

  await mongoose.connect(mongoUri, {});
});

// Hook that will run before each of our test
// Delete/Reset all data present in MongoDB
beforeEach(async () => {
  if (mongoose.connection.db) {
    const collections = await mongoose.connection.db.collections();

    for (let collection of collections) {
      await collection.deleteMany({});
    }
  }
});

// Hook to stop MongoDB memory server
// And to disconnect mongoose after all tests are run
afterAll(async () => {
  if (mongo) {
    await mongo.stop();
  }
  await mongoose.connection.close();
});

// global signup/signin function, for tests, only implements in test env
global.signin = () => {
  // build a JWT payload -> { id, email }
  const payload = {
    id: new mongoose.Types.ObjectId().toHexString(),
    email: "test@test.com",
  };

  // Create the JWT!
  const token = jwt.sign(payload, process.env.JWT_KEY!);

  // Build Session Object -> { jwt: M_JWT }
  const session = { jwt: token };

  // Turn that session into JSON
  const sessionJSON = JSON.stringify(session);

  // Take JSON and encode it as base64
  const base64 = Buffer.from(sessionJSON).toString("base64");

  //return a string -> cookie with encoded data
  return [`session=${base64}`];
};
