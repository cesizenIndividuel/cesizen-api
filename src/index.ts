import "dotenv/config";
import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import cors from "cors";

import { app } from "./app";
import { router } from "./routes";
import { errorMiddleware } from "./middlewares/error.middleware";

// CORS
const allowedOrigins = [
  process.env.FRONTEND_URL,
  process.env.MOBILE_URL,
];

app.use(
  cors({
    origin: function (origin, callback) {
      // autorise requêtes sans origin (mobile, Postman, etc.)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
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

app.listen(port, "0.0.0.0", () => {
  console.log(`API running on http://0.0.0.0:${port}`);
});