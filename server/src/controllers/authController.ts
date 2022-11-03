import { Request, Response, NextFunction } from "express";
import { IUser } from "../models/User";
import { StatusCodes } from "http-status-codes";
import User from "../models/User";
import {
  BadRequestError,
  NotFoundError,
  UnauthenticatedError,
} from "../errors";
import { UserRequest } from "../middleware/auth";

const register = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, email, password }: IUser = req.body;

    if (!name || !email || !password) {
      const error = new BadRequestError("please fill in all values");
      next(error);
    }

    const userAlreadyExists = await User.findOne({ email });
    if (userAlreadyExists) {
      const error = new BadRequestError(
        "please use a different email, as this one already exists"
      );
      next(error);
    }

    const user = await User.create(req.body);
    const token: string = user.createJWT();

    res.status(StatusCodes.CREATED).json({
      user: {
        name: user.name,
        email: user.email,
        lastName: user.lastName,
        location: user.location,
      },
      token,
      location: user.location,
    });
  } catch (err) {
    next(err);
  }
};

const login = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password }: IUser = req.body;

  try {
    if (!email || !password) {
      const error = new BadRequestError("please fill in all fields");
      next(error);
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      const error = new UnauthenticatedError("This user does not exist");
      next(error);
    }

    const isPasswordCorrect: boolean = await user!.comparePassword(password);
    if (!isPasswordCorrect) {
      const error = new UnauthenticatedError("please check your password");
      next(error);
    }

    if (user && isPasswordCorrect) {
      const token: string = user.createJWT();
      user.password = "";
      res.status(StatusCodes.OK).json({ user, token, location: user.location });
    }
  } catch (err) {
    next(err);
  }
};

const updateUser = async (
  req: UserRequest,
  res: Response,
  next: NextFunction
) => {
  const { email, name, lastName, location } = req.body;
  if (!email || !name || !lastName || !location) {
    const errors = new BadRequestError("Please provide all values");
    next(errors);
  }
  try {
    const user = await User.findOne({ _id: req.user.userId });
    if (!user) {
      const errors = new NotFoundError("User not found");
      next(errors);
      return;
    } else {
      user.email = email;
      user.name = name;
      user.lastName = lastName;
      user.location = location;
      await user.save();
    }
    const token = user.createJWT();
    res.status(StatusCodes.OK).json({ user, token, location: user.location });
  } catch (err) {
    next(err);
  }
};

export { register, login, updateUser };
