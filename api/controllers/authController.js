const bcrypt = require("bcryptjs");
const User = require("../models/userModel");
const errorHandler = require("../utils/error");
const jwt = require("jsonwebtoken");

const signup = async (req, resp, next) => {
  const { username, email, password } = req.body;
  const hashPassword = bcrypt.hashSync(password, 10);

  const newUser = new User({ username, email, password: hashPassword });
  try {
    await newUser.save();
    return resp.status(201).json("User created successfully!");
  } catch (error) {
    if (error.code === 11000) {
      return resp.status(400).json("User already exists!");
    }
    next(error);
  }
};

const signin = async (req, resp, next) => {
  const { email, password } = req.body;
  try {
    const validUser = await User.findOne({ email });
    if (!validUser) {
      const error = errorHandler(401, "Wrong credentials");
      return next(error);
    }
    const validPassword = bcrypt.compareSync(password, validUser.password);
    if (!validPassword) {
      const error = errorHandler(401, "Wrong credentials");
      return next(error);
    }
    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET, {
      expiresIn: "5d",
    });
    const { password: pass, ...rest } = validUser._doc;
    return resp
      .cookie("access_token", token, { httpOnly: true })
      .status(200)
      .json(rest);
  } catch (error) {
    next(error);
  }
};

const google = async (req, resp, next) => {
  try {
    console.log(req.body);
    const { email, name, photo } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "5d",
      });
      const { password: pass, ...rest } = user._doc;
      return resp
        .cookie("access_token", token, {
  httpOnly: true,
  secure: false,       // true in production (HTTPS)
  sameSite: "lax",     // try "none" if still not working
})
        .status(200)
        .json(rest);
    } else {
      const generatedPasswod =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const hashedPassword = bcrypt.hashSync(generatedPasswod, 10);
      const newUser = new User({
        username:
          name.split(" ").join("").toLowerCase() +
          Math.random().toString(36).slice(-4),
        email: email,
        password: hashedPassword,
        avatar: photo,
      });
      await newUser.save();
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "5d",
      });
      const { password: pass, ...rest } = newUser._doc;
      return resp
        .cookie("access_token", token, { httpOnly: true })
        .status(201)
        .json(rest);
    }
  } catch (error) {
    next(error);
  }
};

const signOut = async (req, resp, next) => {
  try {
    resp.clearCookie("access_token");
    return resp.satus(200).json("User has been logged out!");
  } catch (error) {
    next(error);
  }
};

module.exports = { signup, signin, google, signOut };
