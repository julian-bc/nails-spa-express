import express from "express";
import config from "./src/config/config.js";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import authRouter from "./src/routes/auth.route.js";
import employeeRouter from "./src/routes/employee.route.js";
import connectDB from "./src/libs/conn.js";

const app = express();

if (config.nodeEnv !== "production") {
  app.use(morgan("dev"));
}

app.use(express.json());
app.use(cookieParser());

connectDB();

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/employee", employeeRouter);

app.listen(config.port, () => {
  console.log(`Server listening on port ${config.port}`);
});
