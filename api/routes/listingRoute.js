const express = require("express");
const verifyToken = require("../utils/verifyUser");
const {
  createListing,
  deleteListing,
  updateListing,
  getListing,
  getListings,
} = require("../controllers/listingController");

const listingRouter = express.Router();

listingRouter.post("/create", verifyToken, createListing);
listingRouter.delete("/delete/:id", verifyToken, deleteListing);
listingRouter.put("/update/:id", verifyToken, updateListing);
listingRouter.get("/get", getListings);
listingRouter.get("/get/:id", getListing);

module.exports = listingRouter;
