import moment from "moment";
import { Types } from "mongoose";
import { NextFunction, Request, Response } from "express";
import Job, { UserJob } from "../models/Job";
import { StatusCodes } from "http-status-codes";
import { BadRequestError, NotFoundError } from "../errors";
import { UserRequest } from "../middleware/auth";
import checkPermissions from "../utils/permissions";
import { ParsedQs } from "qs";

interface Stats {
  _id: "pending" | "interview" | "declined";
  count: number;
}

interface StatsReduced {
  pending: number;
  interview: number;
  declined: number;
}
interface MonthlyApps {
  _id: {
    year: number;
    month: number;
  };
  count: number;
}

interface MonthlyAppsAdj {
  date: string;
  count: number;
}

const createJob = async (
  req: UserRequest,
  res: Response,
  next: NextFunction
) => {
  const { position, company }: UserJob = req.body;


  if (!company || !position) {
    const errors = new BadRequestError("Please Provide all Data values");
    next(errors);
  }

  req.body.createdBy = req.user.userId;
  const job = await Job.create(req.body);
  res.status(StatusCodes.CREATED).json({ job });
};

const deleteJob = async (
  req: UserRequest,
  res: Response,
  next: NextFunction
) => {
  const { id: jobId } = req.params;
  try {
    const job = await Job.findOne({ _id: jobId });
    if (!job) {
      const errors = new NotFoundError("Job not found cannot be deleted");
      next(errors);
    }
    checkPermissions(req.user, job!.createdBy);

    await Job.deleteOne({ _id: jobId });
    res.status(StatusCodes.OK).json({ msg: "Successfully deleted job!" });
  } catch (err) {
    next(err);
  }
};

interface QueryObject {
  createdBy: string;
  status?: string | ParsedQs | string[] | ParsedQs[];
  jobType?: string | ParsedQs | string[] | ParsedQs[];
  position?: string | ParsedQs | string[] | ParsedQs[];
}

const getAllJobs = async (
  req: UserRequest,
  res: Response,
  next: NextFunction
) => {
  const { status, jobType, search, sort } = req.query;

  const queryObject: QueryObject = {
    createdBy: req.user.userId,
  };

  if (status && status !== "all") {
    queryObject.status = status;
  }

  if (jobType && jobType !== "all") {
    queryObject.jobType = jobType;
  }

  if (search) {
    queryObject.position = { $regex: search, $options: "i" };
  }

  let result = Job.find(queryObject);

  if (sort === "latest") {
    result = result.sort("-createdAt");
  }

  if (sort === "oldest") {
    result = result.sort("createdAt");
  }

  if (sort === "a-z") {
    result = result.sort("position");
  }

  if (sort === "z-a") {
    result = result.sort("-position");
  }

  const page: number = Number(req.query.page) || 1;
  const limit: number = Number(req.query.limit) || 4;
  const skip: number = (page - 1) * limit;

  result = result.skip(skip).limit(limit);

  const jobs = await result;

  const totalJobs: number = await Job.countDocuments(queryObject);
  const numOfPages: number = Math.ceil(totalJobs / limit);

  res.status(StatusCodes.OK).json({ jobs, totalJobs, numOfPages });
};

const updateJob = async (
  req: UserRequest,
  res: Response,
  next: NextFunction
) => {
  const { id: jobId } = req.params;
  const { company, position }: UserJob = req.body;
  
  if (!company || !position) {
    const errors = new BadRequestError("Field is empty!!!");
    next(errors);
  }
  try {
    const job = await Job.findOne({ _id: jobId });

    if (!job) {
      const errors = new NotFoundError(`Can't find job with id: ${jobId}`);
      next(errors);
    }

    checkPermissions(req.user, job!.createdBy);

    const updatedJob = await Job.findOneAndUpdate({ _id: jobId }, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(StatusCodes.OK).json({ updatedJob });
  } catch (err) {
    next(err);
  }
};

const showStats = async (req: UserRequest, res: Response) => {
  let stats: Stats[] = await Job.aggregate([
    { $match: { createdBy: new Types.ObjectId(req.user.userId) } },
    { $group: { _id: "$status", count: { $sum: 1 } } },
  ]);

  const statsReduced = stats.reduce((total, currItem) => {
    const { _id: title, count } = currItem;
    total[title] = count;
    return total;
  }, {} as StatsReduced);

  const defaultStats: StatsReduced = {
    pending: statsReduced.pending || 0,
    declined: statsReduced.declined || 0,
    interview: statsReduced.interview || 0,
  };

  const monthlyApps: MonthlyApps[] = await Job.aggregate([
    { $match: { createdBy: new Types.ObjectId(req.user.userId) } },
    {
      $group: {
        _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
        count: { $sum: 1 },
      },
    },
    { $sort: { "_id.year": -1, "_id.month": -1 } },
    { $limit: 6 },
  ]);

  const monthlyApplications: MonthlyAppsAdj[] = monthlyApps
    .map((monthApp) => {
      const {
        _id: { year, month },
        count,
      }: MonthlyApps = monthApp;
      const date = moment()
        .month(month - 1)
        .year(year)
        .format("MMM Y");
      return { date, count };
    })
    .reverse();

  res.status(StatusCodes.OK).json({ defaultStats, monthlyApplications });
};

export { createJob, deleteJob, getAllJobs, updateJob, showStats };
