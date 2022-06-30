const { city, category } = require("../models");

class AdditionalController {
  static async getCities(_req, res, next) {
    try {
      const cities = await city.findAll({
        attributes: ["id", "name"],
      });
      if (cities.length < 1) {
        throw {
          status: 404,
          message: "City data is empty",
        };
      }
      res.status(200).json({
        message: "Success get all cities",
        cities,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getCategories(req, res, next){
    try {
      const categories = await category.findAll({
        attributes: ["id", "name"],
      });
      if (categories.length < 1) {
        throw {
          status: 404,
          message: "Category data is empty",
        };
      }
      res.status(200).json({
        message: "Success get all categories",
        categories,
      });
    } catch (error) {
      next(error)
    }
  }
}

module.exports = AdditionalController;
