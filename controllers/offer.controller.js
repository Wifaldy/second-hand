const { offer, product, notification, user } = require("../models");
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
      if (offeringProduct.id === req.user.id) {
        throw {
          status: 400,
          message: "You can't offer your own product",
        };
      }
      const createdOffer = await offer.create({
        buyer_id: req.user.id,
        product_id: id,
        price_offer: price_offer,
        status: "pending",
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      await notification.create({
        user_id: req.user.id,
        product_id: id,
        offer_id: createdOffer.id,
        title: "Penawaran produk",
        status: "unread",
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      await notification.create({
        user_id: offeringProduct.user_id,
        product_id: id,
        offer_id: createdOffer.id,
        title: "Penawaran produk",
        status: "unread",
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
      sellerId = sellerId.user.id;
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
            attributes: { exclude: ["password"] },
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
      if (findOffer.product.user_id !== req.user.id) {
        throw {
          status: 401,
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
        await notification.create({
          user_id: findOffer.buyer_id,
          product_id: findOffer.product_id,
          offer_id: findOffer.id,
          title: "Penawaran produk",
          status: "unread",
          description: "Kamu akan segera dihubungi penjual via whatsapp",
          createdAt: new Date(),
          updatedAt: new Date(),
        });
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
              id: productId.product.id,
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
