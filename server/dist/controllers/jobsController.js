"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.showStats = exports.updateJob = exports.getAllJobs = exports.deleteJob = exports.createJob = void 0;
const moment_1 = __importDefault(require("moment"));
const mongoose_1 = require("mongoose");
const Job_1 = __importDefault(require("../models/Job"));
const http_status_codes_1 = require("http-status-codes");
const errors_1 = require("../errors");
const permissions_1 = __importDefault(require("../utils/permissions"));
const createJob = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { position, company } = req.body;
    if (!company || !position) {
        const errors = new errors_1.BadRequestError("Please Provide all Data values");
        next(errors);
    }
    req.body.createdBy = req.user.userId;
    const job = yield Job_1.default.create(req.body);
    res.status(http_status_codes_1.StatusCodes.CREATED).json({ job });
});
exports.createJob = createJob;
const deleteJob = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id: jobId } = req.params;
    try {
        const job = yield Job_1.default.findOne({ _id: jobId });
        if (!job) {
            const errors = new errors_1.NotFoundError("Job not found cannot be deleted");
            next(errors);
        }
        (0, permissions_1.default)(req.user, job.createdBy);
        yield Job_1.default.deleteOne({ _id: jobId });
        res.status(http_status_codes_1.StatusCodes.OK).json({ msg: "Successfully deleted job!" });
    }
    catch (err) {
        next(err);
    }
});
exports.deleteJob = deleteJob;
const getAllJobs = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { status, jobType, search, sort } = req.query;
    const queryObject = {
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
    let result = Job_1.default.find(queryObject);
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
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 4;
    const skip = (page - 1) * limit;
    result = result.skip(skip).limit(limit);
    const jobs = yield result;
    const totalJobs = yield Job_1.default.countDocuments(queryObject);
    const numOfPages = Math.ceil(totalJobs / limit);
    res.status(http_status_codes_1.StatusCodes.OK).json({ jobs, totalJobs, numOfPages });
});
exports.getAllJobs = getAllJobs;
const updateJob = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id: jobId } = req.params;
    const { company, position } = req.body;
    if (!company || !position) {
        const errors = new errors_1.BadRequestError("Field is empty!!!");
        next(errors);
    }
    try {
        const job = yield Job_1.default.findOne({ _id: jobId });
        if (!job) {
            const errors = new errors_1.NotFoundError(`Can't find job with id: ${jobId}`);
            next(errors);
        }
        (0, permissions_1.default)(req.user, job.createdBy);
        const updatedJob = yield Job_1.default.findOneAndUpdate({ _id: jobId }, req.body, {
            new: true,
            runValidators: true,
        });
        res.status(http_status_codes_1.StatusCodes.OK).json({ updatedJob });
    }
    catch (err) {
        next(err);
    }
});
exports.updateJob = updateJob;
const showStats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let stats = yield Job_1.default.aggregate([
        { $match: { createdBy: new mongoose_1.Types.ObjectId(req.user.userId) } },
        { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);
    const statsReduced = stats.reduce((total, currItem) => {
        const { _id: title, count } = currItem;
        total[title] = count;
        return total;
    }, {});
    const defaultStats = {
        pending: statsReduced.pending || 0,
        declined: statsReduced.declined || 0,
        interview: statsReduced.interview || 0,
    };
    const monthlyApps = yield Job_1.default.aggregate([
        { $match: { createdBy: new mongoose_1.Types.ObjectId(req.user.userId) } },
        {
            $group: {
                _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
                count: { $sum: 1 },
            },
        },
        { $sort: { "_id.year": -1, "_id.month": -1 } },
        { $limit: 6 },
    ]);
    const monthlyApplications = monthlyApps
        .map((monthApp) => {
        const { _id: { year, month }, count, } = monthApp;
        const date = (0, moment_1.default)()
            .month(month - 1)
            .year(year)
            .format("MMM Y");
        return { date, count };
    })
        .reverse();
    res.status(http_status_codes_1.StatusCodes.OK).json({ defaultStats, monthlyApplications });
});
exports.showStats = showStats;
