import {StatusCodes} from 'http-status-codes'

class CustomError extends Error {
  constructor(public message: string) {
    super(message);
  }
}

class BadRequestError extends CustomError {
  readonly status: StatusCodes;
  constructor(public message: string) {
    super(message);
    this.status = StatusCodes.BAD_REQUEST;
  }
}
class NotFoundError extends CustomError {
  readonly status: StatusCodes;
  constructor(public message: string) {
    super(message);
    this.status = StatusCodes.NOT_FOUND;
  }
}
class UnauthenticatedError extends CustomError {
  readonly status: StatusCodes;
  constructor(public message: string) {
    super(message);
    this.status = StatusCodes.UNAUTHORIZED;
  }
}


export {CustomError, BadRequestError, NotFoundError, UnauthenticatedError }
