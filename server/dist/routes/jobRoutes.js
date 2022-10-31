"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const jobsController_1 = require("../controllers/jobsController");
const auth_1 = __importDefault(require("../middleware/auth"));
const router = express_1.default.Router();
router.route('/').post(auth_1.default, jobsController_1.createJob).get(auth_1.default, jobsController_1.getAllJobs);
router.route('/stats').get(auth_1.default, jobsController_1.showStats);
router.route('/:id').delete(auth_1.default, jobsController_1.deleteJob).patch(auth_1.default, jobsController_1.updateJob);
exports.default = router;
