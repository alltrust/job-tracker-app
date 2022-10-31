import { Request, Response, NextFunction, ErrorRequestHandler } from "express";
import { StatusCodes } from "http-status-codes";

interface defaultError {
  message: string;
  status: StatusCodes;
}

const errorHandlerMiddleware = (
  err: ErrorRequestHandler | any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  
  const defaultError: defaultError = {
    message: err.message || "Something went wrong, try again later",
    status: err.status || StatusCodes.INTERNAL_SERVER_ERROR,
  };
  if (err.name === "ValidationError") {
    defaultError.message = Object.values(err.errors)
      .map((error: any) => error.message)
      .join(", ");
    defaultError.status = StatusCodes.BAD_REQUEST;
  }
  if (err.code && err.code === 11000) {
    defaultError.status = StatusCodes.BAD_REQUEST;
    defaultError.message = `${Object.keys(
      err.keyValue
    )} field has to be unique.`;
  }
  res.status(defaultError.status).json({ message: defaultError.message });
};

export default errorHandlerMiddleware;
