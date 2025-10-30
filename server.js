import express from "express";
import config from "./src/config/config.js";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import authRouter from "./src/routes/auth.route.js";
import employeeRouter from "./src/routes/employee.route.js";
import userRouter from "./src/routes/user.route.js";
import connectDB from "./src/libs/conn.js";
import locationRouter from "./src/routes/location.route.js";
import serviceRouter from "./src/routes/service.route.js";
import citasRouter from "./src/routes/citas.route.js";
import recoveryRouter from "./src/routes/recovery.route.js";
import cors from "cors";
import { swaggerDocs } from "./src/config/swagger.js";

const app = express();

if (config.nodeEnv !== "production") {
  app.use(morgan("dev"));
}

app.use(express.json());
app.use(cookieParser());

app.use(cors({
  origin: config.frontOrigin,
  credentials: true
}));

connectDB();

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/recovery", recoveryRouter);
app.use("/api/v1/employees", employeeRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/locations", locationRouter);
app.use("/api/v1/services", serviceRouter);
app.use("/api/v1/appointments", citasRouter);

app.listen(config.port, () => {
  console.log(`Server listening on port ${config.port}`);
  swaggerDocs(app, config.port)
});