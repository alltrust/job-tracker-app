import { Schema, model, Types, Document } from "mongoose";

export interface UserJob extends Document {
  company: string;
  position: string;
  status: string;
  jobType: string;
  jobLocation: string;
  createdBy: { type: Types.ObjectId; ref: "User" };
}

const JobSchema = new Schema<UserJob>(
  {
    company: {
      type: String,
      required: [true, "Please provide company name"],
      maxLength: 50,
    },
    position: {
      type: String,
      required: [true, "Please provide position"],
      maxlength: 100,
    },
    status: {
      type: String,
      enum: ["interview", "declined", "pending"],
      default: "pending",
    },
    jobType: {
      type: String,
      enum: ["full-time", "part-time", "remote", "internship"],
      default: "full-time",
    },
    jobLocation: {
      type: String,
      default: "my city",
      required: true,
    },
    createdBy: {
      type: Types.ObjectId,
      ref: "User",
      required: [true, "Please provide user"],
    },
  },
  { timestamps: true }
);

export default model<UserJob>("Job", JobSchema);
