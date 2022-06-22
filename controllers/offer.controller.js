const { offer, product, product_tag, user } = require("../models");
const { validationResult } = require("express-validator");

class OfferController {
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
            if (offeringProduct.dataValues.id === req.user.id) {
                throw {
                    status: 400,
                    message: "You can't offer your own product",
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

    static async detailOffering(req, res, next) {
        try {
            const { id } = req.params;
            let sellerId = await offer.findByPk(id, {
                include: [{
                        model: product,
                    },
                    {
                        model: user,
                    },
                ],
            });
            sellerId = sellerId.dataValues.user.dataValues.id;
            if (sellerId !== req.user.id) {
                throw {
                    status: 400,
                    message: "Unauthorized",
                };
            }
            const detailOffering = await offer.findByPk(id, {
                include: [{
                        model: user,
                        where: {
                            id: sellerId,
                        },
                    },
                    {
                        model: product,
                    },
                ],
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

module.exports = OfferController;