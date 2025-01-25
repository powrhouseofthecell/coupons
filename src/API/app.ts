import express, { NextFunction, Request, Response } from "express";
import { default as express_useragent } from "express-useragent";

import helmet from "helmet";
import { default as morgan } from "morgan";
// import cors from "cors";

import { default as global_error_controller } from "./controllers/error/error";
import AppError from "./util/appError";

import router from "./routes/router";

const app = express();

// Development Request Logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Helmet
app.use(helmet());

// Body Parser
app.use(express.json());

// Cookie Parser
// CORS
//app.use(
//  cors({
//    origin: ["https://localhost:5174", "https://localhost:5003"],
//    credentials: true,
//  }),
//);

// Parse the user-agent
app.use(express_useragent.express());
// console.log(req.headers['user-agent']);

app.use((req, res, next) => {
  // console.log('hitting server!');
  // console.log(req.headers['user-agent']);
  // console.log(req.useragent);
  //
  next();
});

app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({
    status: "Running",
  });
});

// Mount the router
app.use("/api/v1/", router);

// Global Error handling middleware:
app.use(global_error_controller);

// Handle NOT FOUND requests:
app.all("*", (req: Request, res: Response, next: NextFunction) => {
  return next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

export default app;
