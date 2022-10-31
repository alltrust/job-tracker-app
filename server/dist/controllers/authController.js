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
exports.updateUser = exports.login = exports.register = void 0;
const http_status_codes_1 = require("http-status-codes");
const User_1 = __importDefault(require("../models/User"));
const errors_1 = require("../errors");
const register = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            const error = new errors_1.BadRequestError("please fill in all values");
            next(error);
        }
        const userAlreadyExists = yield User_1.default.findOne({ email });
        if (userAlreadyExists) {
            const error = new errors_1.BadRequestError("please use a different email, as this one already exists");
            next(error);
        }
        const user = yield User_1.default.create(req.body);
        const token = user.createJWT();
        res.status(http_status_codes_1.StatusCodes.CREATED).json({
            user: {
                name: user.name,
                email: user.email,
                lastName: user.lastName,
                location: user.location,
            },
            token,
            location: user.location,
        });
    }
    catch (err) {
        next(err);
    }
});
exports.register = register;
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            const error = new errors_1.BadRequestError("please fill in all fields");
            next(error);
        }
        const user = yield User_1.default.findOne({ email }).select("+password");
        if (!user) {
            const error = new errors_1.UnauthenticatedError("This user does not exist");
            next(error);
        }
        const isPasswordCorrect = yield user.comparePassword(password);
        if (!isPasswordCorrect) {
            const error = new errors_1.UnauthenticatedError("please check your password");
            next(error);
        }
        if (user && isPasswordCorrect) {
            const token = user.createJWT();
            user.password = "";
            res.status(http_status_codes_1.StatusCodes.OK).json({ user, token, location: user.location });
        }
    }
    catch (err) {
        next(err);
    }
});
exports.login = login;
const updateUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, name, lastName, location } = req.body;
    if (!email || !name || !lastName || !location) {
        const errors = new errors_1.BadRequestError("Please provide all values");
        next(errors);
    }
    try {
        const user = yield User_1.default.findOne({ _id: req.user.userId });
        if (!user) {
            const errors = new errors_1.NotFoundError("User not found");
            next(errors);
            return;
        }
        else {
            user.email = email;
            user.name = name;
            user.lastName = lastName;
            user.location = location;
            yield user.save();
        }
        const token = user.createJWT();
        res.status(http_status_codes_1.StatusCodes.OK).json({ user, token, location: user.location });
    }
    catch (err) {
        next(err);
    }
});
exports.updateUser = updateUser;
