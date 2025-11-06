import { Response, Request, NextFunction } from "express";
import jwt from "jsonwebtoken";

// Creating interface that precisely defines what payload is
interface UserPayload {
  id: string;
  email: string;
}

// Augmenting request object to have property of currentUser
// which can be optionally defined to have typer UserPayload
declare global {
  namespace Express {
    interface Request {
      currentUser?: UserPayload;
    }
  }
}

export const currentUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.session?.jwt) {
    return next();
  }
  try {
    const payload = jwt.verify(
      req.session.jwt,
      process.env.JWT_KEY!
    ) as UserPayload;
    req.currentUser = payload;
  } catch (err) {}

  next();
};
