const bcrypt = require("bcryptjs");
const User = require("../models/userModel");
const errorHandler = require("../utils/error");
const jwt = require("jsonwebtoken");

// 🔹 SIGNUP
const signup = async (req, res, next) => {
  const { username, email, password } = req.body;

  try {
    const hashPassword = bcrypt.hashSync(password, 10);
    const newUser = new User({ username, email, password: hashPassword });

    await newUser.save();
    return res.status(201).json("User created successfully!");
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json("User already exists!");
    }
    next(error);
  }
};

// 🔹 SIGNIN
const signin = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const validUser = await User.findOne({ email });

    if (!validUser) {
      return next(errorHandler(401, "Wrong credentials"));
    }

    const validPassword = bcrypt.compareSync(password, validUser.password);

    if (!validPassword) {
      return next(errorHandler(401, "Wrong credentials"));
    }

    const token = jwt.sign(
      { id: validUser._id },
      process.env.JWT_SECRET,
      { expiresIn: "5d" }
    );

    const { password: pass, ...rest } = validUser._doc;

    return res
      .cookie("access_token", token, {
        httpOnly: true,
        secure: true,        // ✅ required for HTTPS
        sameSite: "none",    // ✅ required for cross-domain
      })
      .status(200)
      .json(rest);

  } catch (error) {
    next(error);
  }
};

// 🔹 GOOGLE AUTH
const google = async (req, res, next) => {
  try {
    const { email, name, photo } = req.body;

    let user = await User.findOne({ email });

    // 🔸 Existing user
    if (user) {
      const token = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET,
        { expiresIn: "5d" }
      );

      const { password: pass, ...rest } = user._doc;

      return res
        .cookie("access_token", token, {
          httpOnly: true,
          secure: true,
          sameSite: "none",
        })
        .status(200)
        .json(rest);
    }

    // 🔸 New user
    const generatedPassword =
      Math.random().toString(36).slice(-8) +
      Math.random().toString(36).slice(-8);

    const hashedPassword = bcrypt.hashSync(generatedPassword, 10);

    const newUser = new User({
      username:
        name.split(" ").join("").toLowerCase() +
        Math.random().toString(36).slice(-4),
      email,
      password: hashedPassword,
      avatar: photo,
    });

    await newUser.save();

    const token = jwt.sign(
      { id: newUser._id }, // ✅ FIXED
      process.env.JWT_SECRET,
      { expiresIn: "5d" }
    );

    const { password: pass, ...rest } = newUser._doc;

    return res
      .cookie("access_token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
      })
      .status(201)
      .json(rest);

  } catch (error) {
    next(error);
  }
};

// 🔹 SIGN OUT
const signOut = async (req, res, next) => {
  try {
    res.clearCookie("access_token", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    return res.status(200).json("User has been logged out!");
  } catch (error) {
    next(error);
  }
};

module.exports = { signup, signin, google, signOut };
