import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import cookieSession from "cookie-session";
import { errorHandler, NotFoundError } from "@axgtickets/common";

import { currentUserRouter } from "./routes/current-user";
import { signinRouter } from "./routes/signin";
import { signoutRouter } from "./routes/signout";
import { signupRouter } from "./routes/signup";

const app = express();
// Since ingress is acting as proxy server to redirect our request
// Express might think the connection to be not secure and reject request
app.set("trust proxy", true);
app.use(json());
app.use(
  cookieSession({
    // Disable encryption
    signed: false,
    // Cookie only used if user visiting app over HTTPs connection
    // In test env, jest makes request over plain HTTP, test fails
    // secure: true,
    // in test env, jest sets NODE_ENV -> 'test', so secure: False
    // in any other env, secure: True (only HTTPs requests)
    secure: process.env.NODE_ENV != "test",
  }),
);

app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);

app.all("*", async () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
