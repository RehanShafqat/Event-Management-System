import express from "express";
import { Request, Response } from "express";
import usersRouter from "./routes/users.router";
const app = express();
import cors from "cors";
import { Router } from "express";
import dotenv from "dotenv";
dotenv.config();
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Hello World" });
});

app.use(`${process.env.BASE_URL}/users`, usersRouter);
