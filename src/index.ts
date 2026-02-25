import "dotenv/config";
import { app } from "./app";
import { router } from "./routes";
import { errorMiddleware } from "./middlewares/error.middleware";
import path from "path";
import express from "express";
import cookieParser from "cookie-parser";

app.use("/api", router);
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.use(errorMiddleware);
app.use(cookieParser());

const port = process.env.PORT ? Number(process.env.PORT) : 3000;

app.listen(port, () => {
  console.log(`API running on http://localhost:${port}`);
});
