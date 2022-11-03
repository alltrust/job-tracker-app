import express from "express";
import {
  createJob,
  deleteJob,
  getAllJobs,
  updateJob,
  showStats,
} from "../controllers/jobsController";
import authMiddleware from "../middleware/auth";
const router = express.Router();

router
  .route("/")
  .post(authMiddleware, createJob)
  .get(authMiddleware, getAllJobs);
router.route("/stats").get(authMiddleware, showStats);
router
  .route("/:id")
  .delete(authMiddleware, deleteJob)
  .patch(authMiddleware, updateJob);

export default router;
