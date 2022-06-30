const AdditionalController = require("../controllers/additional.controller");

const additionalRouter = require("express").Router();

additionalRouter.get("/cities", AdditionalController.getCities);

additionalRouter.get("/categories", AdditionalController.getCategories);

module.exports = additionalRouter;
