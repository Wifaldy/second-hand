const { product, offer, product_tag, user } = require("../models");
// const ProductSingleton = require("../services/temp_product_data.service");
const { validationResult } = require("express-validator");

class ProductController {
    static async detailProduct(req, res, next) {
        try {
            const { id } = req.params;
            const detailProduct = await product.findByPk(id, {
                include: {
                    model: product,
                    attributes: ["name", "price"],
                },
            });
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
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                throw {
                    status: 400,
                    message: errors.array()[0].msg,
                };
            }
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

    // static async previewProduct(req, res, next) {
    //     try {
    //         //   const { name, price, category, description } = req.body;
    //         const filePaths = req.files.map((file) => file.path);
    //         console.log(filePaths);

    //         const dataTemp = ProductSingleton.getInstance();
    //         dataTemp.setData = {
    //             ...req.body,
    //             product_pict: filePaths,
    //         };

    //         res.status(200).json({
    //             preview_data: dataTemp.getData,
    //         });
    //     } catch (error) {
    //         next(error);
    //     }
    // }

    // static async reEditProduct(req, res, next) {
    //     try {
    //         const dataTemp = ProductSingleton.getInstance();
    //         if (!dataTemp.getData) {
    //             throw {
    //                 status: 404,
    //                 message: "Isi update dulu bos",
    //             };
    //         }
    //         res.status(200).json({
    //             preview_data: dataTemp.getData,
    //         });
    //         dataTemp.resetData();
    //     } catch (error) {
    //         console.log(error);
    //         next(error);
    //     }
    // }

    static async createProduct(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                throw {
                    status: 400,
                    message: errors.array()[0].msg,
                };
            }
            const { name, price, description, categories } = req.body;
            const filePaths = req.files.map((file) => file.path);
            const productCreate = await product.create({
                name: name,
                price: price,
                description: description,
                status: "available",
                user_id: req.user.id,
                product_pict: filePaths,
                createdAt: new Date(),
                updatedAt: new Date(),
            });
            categories.split(",").forEach((category) => {
                product_tag.create({
                    product_id: productCreate.id,
                    category_id: +category,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                });
            });
            res.status(201).json({
                message: "Success add new product",
            });
        } catch (error) {
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

    static async getSoldProducts(req, res, next) {
        try {
            const soldProducts = await product.findAll({
                where: {
                    status: "sold",
                    id: req.user.id,
                },
            });
            if (!soldProducts) {
                throw {
                    status: 404,
                    message: "Product not found",
                };
            }
            res.status(200).json(soldProducts);
        } catch (error) {
            next(error);
        }
    }

    static async detailOffering(req, res, next) {
        try {
            const { id } = req.params;
            const detailOffering = await offer.findAll({
                include: [{
                        model: user,
                    },
                    {
                        model: product,
                    },
                ],
                where: {
                    id: id,
                },
            });
            if (!detailOffering) {
                throw {
                    status: 404,
                    message: "Offer not found",
                };
            }
            res.status(200).json({
                message: "Detail Offer",
                data: detailOffering,
            });
        } catch (err) {
            next(err);
        }
    }
}

module.exports = ProductController;