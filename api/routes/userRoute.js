const express = require("express");
const verifyToken = require("../utils/verifyUser");
const {
  getUser,
  getUserListings,
  updateUser,
  deleteUser,
} = require("../controllers/userController");

const userRouter = express.Router();

userRouter.get("/:id", verifyToken, getUser);
userRouter.get("/listings/:id", verifyToken, getUserListings);
userRouter.put("/update/:id", verifyToken, updateUser);
userRouter.delete("/delete/:id", verifyToken, deleteUser);

module.exports = userRouter;
