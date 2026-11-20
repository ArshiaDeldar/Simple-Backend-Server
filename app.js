import express from "express";
import userRoutes from "./routes/userRoutes.js";
import requestLogger from "./middleware/requestLogger.js";
import addRequestTime from "./middleware/addRequestTime.js";
import errorHandler from "./middleware/errorHandler.js";
import authRoutes from "./routes/authRoutes.js";

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const NODE_ENV = process.env.NODE_ENV || "development";
app.use(express.json());

app.use(requestLogger);
app.use(addRequestTime);

app.use("/users", userRoutes);
app.use("/auth", authRoutes);

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    requestTime: req.requestTime,
  });
});

app.get("/about", (req, res) => {
  res.status(200).json({
    name: "My First Express API",
    framework: "Express.js",
  });
});

app.use((req, res) => {
  res.status(404).json({
    message: "Routes not found",
  });
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running in ${NODE_ENV} mode on port ${PORT}`);
});
