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
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw {
          status: 400,
          message: errors.array()[0].msg,
        };
      }
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
          message: "You already offered this product",
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
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw {
          status: 400,
          message: errors.array()[0].msg,
        };
      }
      let sellerId = await offer.findByPk(id, {
        include: [
          {
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
        include: [
          {
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
  static async updateOfferStatus(req, res, next) {
    try {
      const { status, id } = req.params;
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw {
          status: 400,
          message: errors.array()[0].msg,
        };
      }
      const findOffer = await offer.findOne({
        include: {
          model: product,
        },
        where: {
          status: "pending",
          id: id,
        },
      });
      if (!findOffer) {
        throw {
          status: 404,
          message: "Offer not found",
        };
      }
      if (findOffer.dataValues.product.dataValues.user_id !== req.user.id) {
        throw {
          status: 400,
          message: "Unauthorized",
        };
      }
      if (status === "accepted") {
        await offer.update(
          {
            status: "accepted",
            updatedAt: new Date(),
          },
          {
            where: {
              id: id,
            },
          }
        );
      }
      if (status === "rejected") {
        await offer.update(
          {
            status: "rejected",
            updatedAt: new Date(),
          },
          {
            where: {
              id: id,
            },
          }
        );
      }
      if (status === "cancelled") {
        await offer.update(
          {
            status: "cancelled",
            updatedAt: new Date(),
          },
          {
            where: {
              id: id,
            },
          }
        );
      }
      if (status === "success") {
        await offer.update(
          {
            status: "sold",
            updatedAt: new Date(),
          },
          {
            where: {
              id: id,
            },
          }
        );
        const productId = await offer.findOne({
          include: {
            model: product,
          },
          where: {
            status: "sold",
            id: id,
          },
        });
        await product.update(
          {
            status: "sold",
            updatedAt: new Date(),
          },
          {
            where: {
              id: productId.dataValues.product.dataValues.id,
            },
          }
        );
      }
      res.status(200).json({
        message: "Offer status updated",
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = OfferController;
