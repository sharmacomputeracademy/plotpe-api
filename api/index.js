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

app.use(
  cors({
    origin: "*",
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth/", authRouter);
app.use("/api/listing/", listingRouter);
app.use("/api/user/", userRouter);

app.use((err, req, resp, next) => {
  const statusCode = err.statusCode;
  const message = err.message || "Interner Server Error!";
  resp.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

const PORT = process.env.PORT || 9080;

app.listen(PORT, () => {
  console.log(`Server started at port ${PORT}`);
});
