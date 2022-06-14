const { user } = require("../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
class UserController {
    static async postLogin(req, res, next) {
        try {
            const { email, password } = req.body;
            const findUser = await user.findOne({
                where: {
                    email: email,
                },
            });
            if (!findUser) {
                throw {
                    status: 404,
                    message: "User not found",
                };
            }
            const isPasswordMatch = await bcrypt.compare(password, findUser.password);
            if (!isPasswordMatch) {
                throw {
                    status: 400,
                    message: "Email / Password is incorrect",
                };
            }
            const token = jwt.sign({
                    id: findUser.id,
                    email: findUser.email,
                },
                process.env.JWT_SECRET
            );
            res.status(200).json({
                message: "Login success",
                token: token,
            });
        } catch (err) {
            next(err);
        }
    }
}

module.exports = UserController;