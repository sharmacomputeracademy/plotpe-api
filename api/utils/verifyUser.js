const errorHandler = require("./error");
const jwt = require("jsonwebtoken");

const verifyToken = (req, resp, next) => {
  const token = req.cookies.access_token;

  if (!token) {
    const error = errorHandler(401, "Unauthorized");
    next(error);
  }

  jwt.verify(token, process.env.JWT_SECRET, (error, user) => {
    if (error) {
      const error = errorHandler(403, "Forbidden");
      next(error);
    }
    req.user = user;
    next();
  });
};

module.exports = verifyToken;
