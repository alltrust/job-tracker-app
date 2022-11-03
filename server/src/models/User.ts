import bcrypt from "bcryptjs";
import { Schema, model } from "mongoose";
import jwt from "jsonwebtoken";
import validator from "validator";

export interface IUser {
  name: string;
  email: string;
  password: string;
  lastName?: string;
  location?: string;
  createJWT: () => string;
  comparePassword: (candidatePassword: string) => Promise<boolean>;
}

const UserSchema = new Schema<IUser>({
  name: {
    type: String,
    required: [true, "Please provide name"],
    minlength: 2,
    maxlength: 20,
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Please provide email"],
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: "Please provide a valid email",
    },
  },
  password: {
    type: String,
    required: [true, "please provide password"],
    minlength: 6,
    select: false,
  },
  lastName: {
    type: String,
    minlength: 3,
    maxlength: 20,
    trim: true,
    default: "last name",
  },
  location: {
    type: String,
    trim: true,
    default: "My city",
  },
});

UserSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.createJWT = function (): string {
  return jwt.sign({ userId: this._id }, process.env.JWT_SECRET!, {
    expiresIn: process.env.JWT_LIFETIME,
  });
};

UserSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  const isMatch = await bcrypt.compare(candidatePassword, this.password);
  return isMatch;
};

export default model<IUser>("User", UserSchema);
