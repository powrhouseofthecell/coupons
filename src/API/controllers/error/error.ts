import { NextFunction, Request, Response } from "express";
import AppError from "../../util/appError";
import { error } from "console";

interface Custom_Error extends Error {
  statusCode?: number;
  status?: string;
  errmsg?: string;
  code?: string;
  isOperational?: boolean;
  errors?: [Custom_Error];
  path?: string;
  value?: string;
}

const handle_cast_error_DB = (err: Custom_Error) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handle_duplicate_fields_DB = (err: Custom_Error) => {
  const valStrArr = err.errmsg!.match(/(["'])(?:\\.|[^\\])*?\1/);

  let val;
  if (valStrArr) {
    val = valStrArr[0];
  } else {
    val = `{${err.errmsg!.match(/{([^}]*)}/)!["0"].split(" ")[1]}}`;
  }

  // const val = err.errmsg.match(/(["'])(?:\\.|[^\\])*?\1/)[0];
  const message = `Duplicate field value ${val}. Please use another value.`;

  return new AppError(message, 400);
};

// const handleValidationErrorDB = (err: Custom_Error) => {
const handle_validation_error_DB = (err: Custom_Error) => {
  const errors = Object.values(err.errors!).map((cur) => cur.message);

  const message = `Invalid input data. ${errors.join(". ")}`;
  return new AppError(message, 400);
};

const handle_JWT_error = () => new AppError("Invalid token! Please login again.", 401);

const handle_JWT_expired_error = () => {
  return new AppError("Your token has expired. Please login again.", 401);
};

const send_error_dev = (err: Custom_Error, res: Response) => {
  res.status(err.statusCode!).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });

  console.log(err);
};

const send_error_production = (err: Custom_Error, res: Response) => {
  // Operational error: Send message to the client
  if (err.isOperational) {
    return res.status(err.statusCode!).json({
      status: err.status,
      message: err.errmsg || err.message, // FIX IT: err.errmsg is not consistent: sometimes it works with errmsg and sometimes with .message
    });

    // Programming or other unknown error: Don't leak error details
  } else {
    // Log the error to the console
    console.error("Error ***: ", err);

    // Send generic error message in response
    return res.status(500).json({
      status: "error",
      message: "Something went very wrong",
    });
  }
};

const error_controller = (err: Custom_Error, req: Request, res: Response, next: NextFunction) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    send_error_dev(err, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = { ...err };
    error.name = err.name;
    error.errmsg = err.message;

    if (error.name === "CastError") error = handle_cast_error_DB(error);
    if (parseInt(error.code!) === 11000) error = handle_duplicate_fields_DB(error);
    if (error.name === "ValidationError") error = handle_validation_error_DB(error);

    if (error.name === "JsonWebTokenError") error = handle_JWT_error();
    if (error.name === "TokenExpiredError") error = handle_JWT_expired_error();

    send_error_production(error, res);
  }
};

export default error_controller;
