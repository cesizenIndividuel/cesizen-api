import "dotenv/config";
import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import cors from "cors";

import { app } from "./app";
import { router } from "./routes";
import { errorMiddleware } from "./middlewares/error.middleware";

// CORS
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

// 1) Parse cookies 
app.use(cookieParser()); 

// 2) Routes
app.use("/api", router);

// 3) Static (uploads)
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// 4) Error middleware EN DERNIER
app.use(errorMiddleware);

const port = process.env.PORT ? Number(process.env.PORT) : 3000;

app.listen(port, () => {console.log(`API running on http://localhost:${port}`)});