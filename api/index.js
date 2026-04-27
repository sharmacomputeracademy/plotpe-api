const express = require("express");
const dotenv = require("dotenv");
const authRouter = require("./routes/authRoute");
const connectDB = require("./config/db");
const listingRouter = require("./routes/listingRoute");
const cookieParser = require("cookie-parser");
const userRouter = require("./routes/userRoute");
const cors = require("cors");

dotenv.config();
connectDB();

const app = express();

// ✅ CORS (IMPORTANT)
app.use(
  cors({
    origin: "https://scalive.in", // frontend domain
    credentials: true,
  })
);

// ✅ Middleware
app.use(express.json());
app.use(cookieParser());

// ✅ Routes
app.use("/api/auth", authRouter);
app.use("/api/listing", listingRouter);
app.use("/api/user", userRouter);

// ✅ Error handler
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

const PORT = process.env.PORT || 9080;

app.listen(PORT, () => {
  console.log(`Server started at port ${PORT}`);
});
