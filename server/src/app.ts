import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/database";
import { errorHandler } from "./middleware/error.middleware";
import redisClient from "./config/redis";

dotenv.config();

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", async (req: Request, res: Response) => {
  // await redisClient.set("test", "Hello World");
  res.status(200).json({
    success: true,
    message: "Hello World",
  });
});

app.listen(process.env.PORT, () => {
  // console.log(`Server is running on port localhost:${process.env.PORT}`);
});

// Routes

// Error handling
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  errorHandler(err, req, res, next);
});

export default app;
