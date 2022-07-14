const { Op } = require("sequelize");
const {
  product,
  offer,
  product_tag,
  category,
  user,
  notification,
  city,
} = require("../models");
const ProductSingleton = require("../services/temp_product_data.service");
const { validationResult } = require("express-validator");
const sequelize = require("sequelize");

const {
  deletePict,
  uploadToCloudinary,
} = require("../services/cloudinary.service");

require("dotenv").config();

class ProductController {
  // Search by name product, ...

  // All Product
  static async listProduct(req, res, next) {
    try {
      const userId = req.user ? req.user.id : 0;
      const categoryName = req.query.category || "";
      const searchName = req.query.search || "";
      // const { offset, limit } = req.query;
      const page = req.query.page > 0 ? req.query.page : 1;
      const limit = req.query.limit > 0 ? req.query.limit : 10;
      const offset = (page - 1) * limit;
      const listProducts = await product.findAndCountAll({
        order: [["createdAt", "DESC"]],
        offset,
        limit,
        distinct: true,
        where: {
          name: {
            [Op.iLike]: `%${searchName}%`,
          },
          user_id: {
            [Op.ne]: userId,
          },
          status: "available",
        },
        include: [
          {
            model: product_tag,
            // as: 'categories',
            attributes: [
              "category_id",
              [
                sequelize.literal('"product_tags->category"."name"'),
                "category_name",
              ],
            ],
            include: {
              model: category,
              attributes: [],
              duplicating: false,
              where: {
                name: {
                  [Op.iLike]: `%${categoryName}%`,
                },
              },
              required: true,
            },
          },
        ],
      });
      if (!listProducts.rows[0]) {
        throw {
          status: 404,
          message: "Product not found",
        };
      } else {
        res.status(200).json({
          message: "List Products",
          data: listProducts,
        });
      }
    } catch (err) {
      next(err);
    }
  }

  static async detailProduct(req, res, next) {
    try {
      const { id } = req.params;
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw {
          status: 400,
          message: errors.array()[0].msg,
        };
      }
      const detailProduct = await product.findByPk(id, {
        include: [
          {
            model: user,
            attributes: { exclude: ["password"] },
          },
          {
            model: product_tag,
            include: {
              model: category,
            },
          },
        ],
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

  static async getPreviewProduct(req, res, next) {
    try {
      //   const { name, price, category, description } = req.body;

      const dataTemp = ProductSingleton.getInstance();
      if (!dataTemp.getData(req.user.id)) {
        throw {
          status: 404,
          message: "Product not found",
        };
      }
      res.status(200).json({
        preview_data: dataTemp.getData(req.user.id),
      });
    } catch (error) {
      next(error);
    }
  }
  static async postPreviewProduct(req, res, next) {
    try {
      //   const { name, price, category, description } = req.body;
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw {
          status: 400,
          message: errors.array()[0].msg,
        };
      }

      const filePaths = await uploadToCloudinary(req.files, "preview");
      const findUser = await user.findByPk(req.user.id, {
        attributes: { exclude: ["password", "id"] },
        include: {
          model: city,
        },
      });
      const dataTemp = ProductSingleton.getInstance();
      dataTemp.setData = {
        user_id: req.user.id,
        ...req.body,
        ...findUser.dataValues,
        product_pict: filePaths,
      };
      res.status(200).json({
        message: "Success add preview product",
      });
    } catch (error) {
      next(error);
    }
  }

  static async reEditProduct(req, res, next) {
    try {
      const dataTemp = ProductSingleton.getInstance();
      if (!dataTemp.getData(req.user.id)) {
        throw {
          status: 404,
          message: "Product not found",
        };
      }
      res.status(200).json({
        preview_data: dataTemp.getData(req.user.id),
      });
      dataTemp.resetData(req.user.id);
    } catch (error) {
      next(error);
    }
  }

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

      const filePaths = await uploadToCloudinary(req.files, "product");

      //Isi file paths => public//user//
      //Product pict => (URL)/public/user/detail-gambar.ext
      const productCreate = await product.create({
        user_id: req.user.id,
        name,
        price,
        description,
        status: "available",
        product_pict: filePaths,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      let tempCategories;
      if (!Array.isArray(categories)) {
        tempCategories = categories.split(",");
      } else {
        tempCategories = categories;
      }
      tempCategories.forEach(async (categoryId) => {
        await product_tag.create({
          product_id: productCreate.id,
          category_id: categoryId,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      });
      await notification.create({
        user_id: req.user.id,
        product_id: productCreate.id,
        title: "Berhasil di terbitkan",
        status: "unread",
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      res.status(201).json({
        message: "Success add new product",
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateProduct(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw {
          status: 400,
          message: errors.array()[0].msg,
        };
      }
      const { name, price, description, categories } = req.body;
      const { id } = req.params;

      const getProduct = await product.findOne({
        where: {
          user_id: req.user.id,
          id,
        },
      });
      if (!getProduct) {
        throw {
          status: 401,
          message: "The product is not yours",
        };
      }
      getProduct.product_pict.forEach(async (product_pict) => {
        await deletePict(product_pict, "product");
      });
      const filePaths = await uploadToCloudinary(req.files, "product");
      await product.update(
        {
          name,
          price,
          description,
          product_pict: filePaths,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          where: {
            id,
          },
        }
      );

      const oldCategories = await product_tag.findAll({
        where: {
          product_id: +id,
        },
      });
      for (const oldTag of oldCategories) {
        await product_tag.destroy({
          where: {
            id: oldTag.id,
          },
        });
      }
      for (const newTag of categories) {
        await product_tag.create({
          product_id: id,
          category_id: Number(newTag),
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }

      res.status(200).json({
        message: "Success update product",
      });
    } catch (error) {
      next(error);
    }
  }

  static async deleteProduct(req, res, next) {
    try {
      const { id } = req.params;
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw {
          status: 400,
          message: errors.array()[0].msg,
        };
      }
      const findProduct = await product.findByPk(id);
      if (!findProduct) {
        throw {
          status: 404,
          message: "Product not found",
        };
      }
      if (findProduct.user_id !== req.user.id) {
        throw {
          status: 401,
          message: "Unauthorized",
        };
      }
      findProduct.product_pict.forEach(async (product_pict) => {
        await deletePict(product_pict, "product");
      });
      await product.destroy({
        where: {
          id,
        },
      });
      res.status(200).json({
        message: "Success delete product",
      });
    } catch (err) {
      next(err);
    }
  }

  static async productByUser(req, res, next) {
    try {
      const productByUser = await product.findAll({
        where: {
          user_id: req.user.id,
        },
      });
      if (productByUser.length === 0) {
        throw {
          status: 404,
          message: "Product not found",
        };
      }
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
          user_id: req.user.id,
          status: "sold",
        },
        include: {
          model: product_tag,
          // nested: true,
          include: [
            {
              model: category,
              attributes: [],
              // attributes: ['name']
            },
          ],
          attributes: [
            [sequelize.literal('"product_tags->category"."id"'), "id"],
            [
              sequelize.literal('"product_tags->category"."name"'),
              "category_name",
            ],
          ],
        },
      });
      if (soldProducts.length === 0) {
        throw {
          status: 404,
          message: "Product not found",
        };
      }
      res.status(200).json({ data: soldProducts });
    } catch (error) {
      next(error);
    }
  }

  static async getOfferedProducts(req, res, next) {
    try {
      const offeredProducts = await offer.findAll({
        include: {
          model: product,
          where: {
            user_id: req.user.id,
          },
        },
        where: {
          status: "pending",
        },
      });
      if (!offeredProducts[0]) {
        throw {
          status: 404,
          message: "Product not found",
        };
      } else {
        res.status(200).json({
          message: "Offered products",
          data: offeredProducts,
        });
      }
    } catch (err) {
      next(err);
    }
  }
}

module.exports = ProductController;
