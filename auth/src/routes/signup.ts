import express, { Request, Response } from "express";
// Using Express-validator library for email and password validation
import { body } from "express-validator";
import jwt from "jsonwebtoken";
import { validateRequest, BadRequestError } from "@axgtickets/common";

import { User } from "../models/user";

const router = express.Router();
router.post(
  "/api/users/signup",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password")
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage("Password must be between 4 and 20 charachters"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });

    // Making sure, user have unique email while signing up
    if (existingUser) {
      throw new BadRequestError("Email in Use");
    }

    // Saving the user to DB
    const user = User.build({ email, password });
    await user.save();

    // Generate JWT
    const userJwt = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      // Accessing env variables with Node.js
      // ! - tells Typescript compiler that value is not null or undefined
      // Since we already checked that value in ./index.ts
      process.env.JWT_KEY!
    );

    // store it on session object
    req.session = {
      jwt: userJwt,
    };

    res.status(201).send(user);
  }
);

export { router as signupRouter };
