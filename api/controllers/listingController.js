const Listing = require("../models/listingModel");
const errorHandler = require("../utils/error");

const createListing = async (req, resp, next) => {
  try {
    const listing = await Listing.create(req.body);
    resp.status(201).json(listing);
  } catch (error) {
    next(error);
  }
};

const deleteListing = async (req, resp, next) => {
  const id = req.params.id;
  const listing = await Listing.findById(id);

  if (!listing) {
    const error = errorHandler(404, "Listing not found!");
    next(error);
  }
  if (req.user.id !== listing.userRef) {
    const error = errorHandler(401, "You can only delete your own listings!");
    next(error);
  }
  try {
    await Listing.findByIdAndDelete(id);
    resp.status(200).json("Listing has been deleted!");
  } catch (error) {
    next(error);
  }
};

const updateListing = async (req, resp, next) => {
  const id = req.params.id;
  try {
    const listing = await Listing.findById(id);
    if (!listing) {
      const error = errorHandler(404, "Listing not found!");
      next(error);
    }
    if (req.user.id !== listing.userRef) {
      next(errorHandler(401, "You can only update your own listings!"));
    }
    const updatedListing = await Listing.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    resp.status(200).json(updatedListing);
  } catch (error) {
    next(error);
  }
};

const getListing = async (req, resp, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      next(errorHandler(404, "Listing not found!"));
    }
    resp.status(200).json(listing);
  } catch (error) {
    next(error);
  }
};

const getListings = async (req, resp, next) => {
  try {
    const limit = parseInt(req.query.limit) || 9;
    const startIndex = parseInt(req.query.startIndex) || 0;

    let offer = req.query.offer;
    if (offer === "true") offer = true;
    else if (offer === "false") offer = false;
    else offer = { $in: [true, false] };

    let furnished = req.query.furnished;
    if (furnished === "true") furnished = true;
    else if (furnished === "false") furnished = false;
    else furnished = { $in: [true, false] };

    let parking = req.query.parking;
    if (parking === "true") parking = true;
    else if (parking === "false") parking = false;
    else parking = { $in: [true, false] };

    let type = req.query.type;
    if (!type || type === "all") {
      type = { $in: ["sale", "rent"] };
    }

    const searchTerm = req.query.searchTerm || "";
    const sort = req.query.sort || "createdAt";
    const order = req.query.order === "asc" ? 1 : -1;

    const listings = await Listing.find({
      name: { $regex: searchTerm, $options: "i" },
      offer,
      furnished,
      parking,
      type,
    })
      .sort({ [sort]: order }) // ✅ fixed
      .limit(limit)
      .skip(startIndex);

    resp.status(200).json(listings);

  } catch (error) {
    console.error("GET LISTINGS ERROR:", error); // 🔥 VERY IMPORTANT
    next(error);
  }
};

module.exports = {
  createListing,
  deleteListing,
  updateListing,
  getListing,
  getListings,
};
