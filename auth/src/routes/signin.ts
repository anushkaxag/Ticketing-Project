import express, { Request, Response } from "express";
import { body } from "express-validator";
import jwt from "jsonwebtoken";
import { validateRequest, BadRequestError } from "@axgtickets/common";

import { Password } from "../services/password";
import { User } from "../models/user";

const router = express.Router();
router.post(
  "/api/users/signin",
  [
    body("email").isEmail().withMessage("Email must be vlaid"),
    body("password")
      .trim()
      .notEmpty()
      .withMessage("You must supply a Password"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      throw new BadRequestError("Invalid Credentials");
    }

    const passwordsMatch = await Password.compare(
      existingUser.password,
      password
    );
    if (!passwordsMatch) {
      throw new BadRequestError("Invalid Credentials");
    }

    // Generate JWT
    const userJwt = jwt.sign(
      {
        id: existingUser.id,
        email: existingUser.email,
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

    res.status(200).send(existingUser);
  }
);

export { router as signinRouter };
