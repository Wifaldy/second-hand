const { city } = require("../models");

class AdditionalController {
    static async getCities(_req, res, next){
        try {
            const cities = await city.findAll({
                attributes: ['id', 'name']
            });
            if(!cities){
                throw {
                    status: 404,
                    message: 'City data is empty'
                }
            }
            res.status(200).json({
                message: 'Success get all cities',
                cities,
            });
        } catch (error) {
            next(error)
        }
    }
}

module.exports = AdditionalController;