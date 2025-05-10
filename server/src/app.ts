import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/database";
import { errorHandler } from "./middleware/error.middleware";
// import redisClient from "./config/redis";
import logger from "./utils/logger";
import AuthRoutes from "./routes/auth.routes";
import helmet from "helmet";
import morgan from "morgan";
import swaggerJSDoc from "swagger-jsdoc";
import { swaggerOptions } from "./config/swagger";
import swaggerUi from "swagger-ui-express";
dotenv.config();

const app = express();

// Connect to MongoDB

// Middleware
app.use(
  cors({
    origin: ["http://127.0.0.1:5500", "http://localhost:5500"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", async (req: Request, res: Response) => {
  // await redisClient.set("test", "Hello World");
  res.status(200).json({
    success: true,
    message: "Hello World",
  });
});

connectDB().then(() => {
  app.listen(process.env.PORT, () => {
    logger.info(`Server is running on port localhost:${process.env.PORT}`);
  });
});

app.use(helmet());
app.use(morgan("dev"));

// Swagger documentation
const specs = swaggerJSDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

// Routes
app.use("/api/auth", AuthRoutes);
// Error handling
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  errorHandler(err, req, res, next);
});

export default app;
