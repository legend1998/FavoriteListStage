import express, { Request, Response, NextFunction } from "express";
import favoriteRouter from "./routes/favoriteRoute";
import connectDB from "./db/database";
import { errorHandler } from "./errorhandler";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

connectDB();

app.use(express.json());

app.use("/favorite", favoriteRouter);

app.get("/", (req, res) => {
  res.status(200).send("hello world");
});

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

export default app;
