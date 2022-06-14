const { user } = require('../models')
class UserController{

    static async registerUser(req, res, next){
        try {
            const { name, email, password} = req.body;
            if (!name || !email || !password ) throw {
                status: 400,
                message: 'Name, Email, or Password should not be empty'
            }
            await user.create({
                name,
                email,
                password,
                createdAt: new Date,
                updatedAt: new Date(),
            })
        } catch (error) {
            next(error);
        }
    }


}

module.exports = UserController;