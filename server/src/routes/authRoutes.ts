import { register, login, updateUser } from "../controllers/authController";
import  rateLimiter  from "express-rate-limit";
import authMiddleware from "../middleware/auth";
import express from 'express'

const apiLimiter = rateLimiter({
    windowMs: 15*60*1000,
    max: 10,
    message: "too many requests from this IP, please try again in 15 minutes"
})

const router = express.Router()

router.route('/register').post(apiLimiter, register)
router.route('/login').post(apiLimiter, login)
router.route('/updateUser').patch(authMiddleware, updateUser)

export default router