const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization;
        if (!token) {
            throw {
                status: 401,
                message: "Unauthorized",
            };
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded.id) {
            throw {
                status: 401,
                message: "Unauthorized",
            };
        }
        req.user = decoded;
        next();
    } catch (err) {
        next(err);
    }
};