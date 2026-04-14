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
    if (offer === undefined || offer == "false") {
      offer = { $in: [false, true] };
    }

    let furnished = req.query.furnished;
    if (furnished === undefined || furnished === "false") {
      furnished = { $in: [false, true] };
    }

    let parking = req.query.parking;
    if (parking === undefined || parking === "false") {
      parking = { $in: [false, true] };
    }

    let type = req.query.type;

    if (type === undefined || type === "all") {
      type = { $in: ["sale", "rent"] };
    }
    const searchTerm = req.query.searchTerm || "";
    const sort = req.query.sort || "createdAt";
    const order = req.query.order || "desc";
    const listings = await Listing.find({
      name: { $regex: searchTerm, $options: "i" },
      offer,
      furnished,
      parking,
      type,
    })
      .sort({ [sort]: order })
      .limit(limit)
      .skip(startIndex);
    resp.status(200).json(listings);
  } catch (error) {
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
