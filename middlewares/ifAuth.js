const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    if (req.headers.authorization) {
      const token = req.headers.authorization.split(" ")[1];
      if (!token) {
        throw {
          status: 401,
          message: "Unauthorized",
        };
      }
      jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
          throw {
            status: 401,
            message: "Token invalid",
          };
        }
        req.user = decoded;
      });
      next();
    } else {
      next()
    }
  } catch (err) {
    next(err);
  }
};