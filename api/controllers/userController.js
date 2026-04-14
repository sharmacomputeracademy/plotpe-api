const User = require("../models/userModel");
const Listing = require("../models/listingModel");
const errorHandler = require("../utils/error");
const bcryptjs = require("bcryptjs");

const getUser = async (req, resp, next) => {
  try {
    const id = req.params.id;
    const user = await User.findById(id);
    if (!user) {
      next(errorHandler(404, "User not found!"));
    }
    const { password: pass, ...rest } = user._doc;
    resp.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

const getUserListings = async (req, resp, next) => {
  const id = req.params.id;

  if (id === req.user.id) {
    try {
      const listings = await Listing.find({ userRef: id });
      resp.status(200).json(listings);
    } catch (error) {
      next(error);
    }
  } else {
    next(errorHandler(401, "You can only view your own listings"));
  }
};

const deleteUser = async (req, resp, next) => {
  const id = req.params.id;

  try {
    if (id !== req.user.id) {
      next(errorHandler(401, "You can only delete your own account!"));
    } else {
      await User.findByIdAndDelete(id);
      resp.clearCookie("access_token");
      resp.status(200).json("User has been deleted!");
    }
  } catch (error) {
    next(error);
  }
};

const updateUser = async (req, resp, next) => {
  const id = req.params.id;

  if (id !== req.user.id) {
    next(errorHandler(401, "You can only update your own account!"));
  } else {
    try {
      if (req.body.password) {
        req.body.password = bcryptjs.hashSync(req.body.password, 10);
      }
      const updatedUser = await User.findByIdAndUpdate(
        id,
        {
          $set: {
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
            avatar: req.body.avatar,
          },
        },
        { new: true },
      );
      const { password: pass, ...rest } = updatedUser._doc;
      resp.status(200).json(rest);
    } catch (error) {
      next(error);
    }
  }
};

module.exports = {
  getUser,
  getUserListings,
  updateUser,
  deleteUser,
};
