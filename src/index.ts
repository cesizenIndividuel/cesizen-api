import "dotenv/config";
import { app } from "./app";
import { router } from "./routes";
import { errorMiddleware } from "./middlewares/error.middleware";

app.use("/api", router);

app.use(errorMiddleware);

const port = process.env.PORT ? Number(process.env.PORT) : 3000;

app.listen(port, () => {
  console.log(`API running on http://localhost:${port}`);
});
