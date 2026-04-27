const express = require("express");
const verifyToken = require("../utils/verifyUser");
const {
  getUser,
  getUserListings,
  updateUser,
  deleteUser,
} = require("../controllers/userController");

const userRouter = express.Router();

// ✅ SPECIFIC ROUTES FIRST
userRouter.get("/listings/:id", verifyToken, getUserListings);
userRouter.put("/update/:id", verifyToken, updateUser);
userRouter.delete("/delete/:id", verifyToken, deleteUser);

// 🔻 GENERIC ROUTE LAST
userRouter.get("/:id", verifyToken, getUser);

module.exports = userRouter;
