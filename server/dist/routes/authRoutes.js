"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const authController_1 = require("../controllers/authController");
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const auth_1 = __importDefault(require("../middleware/auth"));
const express_1 = __importDefault(require("express"));
const apiLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: "too many requests from this IP, please try again in 15 minutes"
});
const router = express_1.default.Router();
router.route('/register').post(apiLimiter, authController_1.register);
router.route('/login').post(apiLimiter, authController_1.login);
router.route('/updateUser').patch(auth_1.default, authController_1.updateUser);
exports.default = router;
