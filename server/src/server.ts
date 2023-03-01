import express, { Request, Response } from "express";
import dotenv from "dotenv";
dotenv.config();

import morgan from "morgan";
import cors from "cors";
import connectDB from "./db/connect";

import authRouter from "./routes/authRoutes";
import jobsRouter from "./routes/jobRoutes";

import errorHandlerMiddleware from "./middleware/error-handler";
import notFoundMiddlware from "./middleware/not-found";
import path from "path";

import helmet from "helmet";
//@ts-ignore
import xss from "xss-clean";
import mongoSanitize from "express-mongo-sanitize";

const app = express();

const port: string | number = process.env.PORT || 5000;

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}
app.use(cors());
app.use(express.json());

app.use(helmet());
app.use(xss());
app.use(mongoSanitize());

app.use(express.static(path.resolve(__dirname, "../../client/build")));

app.get("/", (req: Request, res: Response) => {
  res.json({ message: "welcome" });
});
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/jobs", jobsRouter);

app.get("*", function (request, response) {
  response.sendFile(
    path.resolve(__dirname, "../../client/build", "index.html")
  );
});

app.use(notFoundMiddlware);
app.use(errorHandlerMiddleware);

const startServer = async () => {
  try {
    if (process.env.MONGO_URL) {
      await connectDB(process.env.MONGO_URL);
    }
    app.listen(port, (): void => {
      console.log(`listening on ${port} okok!!`);
    });
  } catch (error) {
    console.log(error);
  }
};

startServer();
