const express = require("express");
const {
  signup,
  signin,
  google,
  signOut,
} = require("../controllers/authController");

const authRouter = express.Router();

authRouter.post("/signup", signup);
authRouter.post("/signin", signin);
authRouter.post("/google", google);
authRouter.get("/signout", signOut);

module.exports = authRouter;
