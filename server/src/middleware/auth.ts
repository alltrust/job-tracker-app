import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { UnauthenticatedError } from "../errors";

export interface UserRequest extends Request {
  user?: Record<string, unknown>;
}

interface UserJWTPayload extends JwtPayload {
  userId?: string;
}

const authMiddleware = async (
  req: UserRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeaders: string | undefined = req.headers.authorization;
  if (!authHeaders || !authHeaders.startsWith("Bearer")) {
    const errors = new UnauthenticatedError("Authentication invalid");
    next(errors);
  }

  const token = authHeaders!.split(" ")[1];
  try {
    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as UserJWTPayload;

    const { userId } = payload;
    req.user = { userId: userId };
    next();
  } catch (err) {
    const errors = new UnauthenticatedError("Authentication invalid");
    next(errors);
  }
};

export default authMiddleware;
