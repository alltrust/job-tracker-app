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
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const mongoose_1 = require("mongoose");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const validator_1 = __importDefault(require("validator"));
const UserSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, "Please provide name"],
        minlength: 2,
        maxlength: 20,
        trim: true
    },
    email: {
        type: String,
        required: [true, "Please provide email"],
        unique: true,
        validate: {
            validator: validator_1.default.isEmail,
            message: "Please provide a valid email"
        }
    },
    password: {
        type: String,
        required: [true, "please provide password"],
        minlength: 6,
        select: false
    },
    lastName: {
        type: String,
        minlength: 3,
        maxlength: 20,
        trim: true,
        default: 'last name'
    },
    location: {
        type: String,
        trim: true,
        default: "My city"
    }
});
UserSchema.pre('save', function () {
    return __awaiter(this, void 0, void 0, function* () {
        if (!this.isModified('password'))
            return;
        const salt = yield bcryptjs_1.default.genSalt(10);
        this.password = yield bcryptjs_1.default.hash(this.password, salt);
    });
});
UserSchema.methods.createJWT = function () {
    return jsonwebtoken_1.default.sign({ userId: this._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_LIFETIME });
};
UserSchema.methods.comparePassword = function (candidatePassword) {
    return __awaiter(this, void 0, void 0, function* () {
        const isMatch = yield bcryptjs_1.default.compare(candidatePassword, this.password);
        return isMatch;
    });
};
exports.default = (0, mongoose_1.model)('User', UserSchema);
