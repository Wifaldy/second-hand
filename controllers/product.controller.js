const { product, offer, user } = require("../models");
const ProductSingleton = require("../services/temp_product_data.service");

class ProductController {
    static async detailProduct(req, res, next) {
        try {
            const { id } = req.params;
            const detailProduct = await product.findByPk(id);
            if (!detailProduct) {
                throw {
                    status: 404,
                    message: "Product not found",
                };
            }
            res.status(200).json({
                message: "Detail Product",
                data: detailProduct,
            });
        } catch (err) {
            next(err);
        }
    }

    static async offeringProduct(req, res, next) {
        try {
            const { price_offer } = req.body;
            const { id } = req.params;
            const offeringProduct = await product.findByPk(id);
            if (!offeringProduct) {
                throw {
                    status: 404,
                    message: "Product not found",
                };
            }
            await offer.create({
                buyer_id: req.user.id,
                product_id: id,
                price_offer: price_offer,
                status: "pending",
                createdAt: new Date(),
                updatedAt: new Date(),
            });
            res.status(201).json({
                message: "Offering Success",
            });
        } catch (err) {
            next(err);
        }
    }

    static async isOffering(req, res, next) {
        try {
            const { id } = req.params;
            const isOffering = await offer.findOne({
                where: {
                    buyer_id: req.user.id,
                    product_id: id,
                    status: "pending",
                },
            });
            if (isOffering) {
                throw {
                    status: 400,
                    message: "Offering is not valid",
                };
            }
            res.status(200).json({
                message: "Offering is valid",
            });
        } catch (err) {
            next(err);
        }
    }

    static async previewProduct(req, res, next) {
        try {
            //   const { name, price, category, description } = req.body;
            const filePaths = req.files.map((file) => file.path);
            console.log(filePaths);

            const dataTemp = ProductSingleton.getInstance();
            dataTemp.setData = {
                ...req.body,
                product_pict: filePaths,
            };

            res.status(200).json({
                preview_data: dataTemp.getData,
            });
        } catch (error) {
            next(error);
        }
    }

    static async reEditProduct(req, res, next) {
        try {
            const dataTemp = ProductSingleton.getInstance();
            if (!dataTemp.getData) {
                throw {
                    status: 404,
                    message: "Isi update dulu bos",
                };
            }
            res.status(200).json({
                preview_data: dataTemp.getData,
            });
            dataTemp.resetData();
        } catch (error) {
            console.log(error);
            next(error);
        }
    }

    static async updateProduct(req, res, next) {
        try {
            const { id } = req.params;
            //   const { name, price, category, description } = req.body;
            const filePaths = req.files.map((file) => file.path);
            await product.update({
                ...req.body,
                product_pict: filePaths,
            }, {
                where: {
                    id,
                },
            });
            res.status(200).json({
                message: "Success update product",
            });
        } catch (error) {
            console.log(error);
            next(error);
        }
    }

    static async productByUser(req, res, next) {
        try {
            const productByUser = await product.findAll({
                where: {
                    user_id: req.user.id,
                },
            });
            res.status(200).json({
                message: "Product by user",
                data: productByUser,
            });
        } catch (err) {
            next(err);
        }
    }
}

module.exports = ProductController;