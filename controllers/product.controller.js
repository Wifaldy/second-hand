const { Op } = require("sequelize");
const { product, offer, product_tag, category, user } = require("../models");
// const ProductSingleton = require("../services/temp_product_data.service");
const { validationResult } = require("express-validator");
const sequelize = require("sequelize");

class ProductController {
  // Search by name product, ....
  static async searchProduct(req, res, next) {
    try {
      const productSearch = await product.findAll({
        order: [["createdAt", "DESC"]],
        where: {
          name: {
            [Op.iLike]: `%${req.query.name}%`,
          },
        },
      });

      if (!productSearch) {
        throw {
          status: 200,
          message: "Product Not Found",
        };
      } else {
        res.status(200).json(productSearch);
      }
    } catch (err) {
      next(err);
    }
  }

  // All Product
  static async listProduct(req, res, next) {
    try {
      const categoryName = req.query.category || "";
      const { offset, limit } = req.query;
      const listProducts = await product.findAndCountAll({
        order: [["createdAt", "DESC"]],
        offset,
        limit,
        subQuery: false,
        where: {
          "$product_tags.category.name$": {
            [Op.iLike]: `%${categoryName}%`,
          },
        },
        include: {
          model: product_tag,
          // as: 'Categories',
          attributes: ["category_id"],
          include: {
            model: category,
            attributes: ["name"],
          },
        },
      });
      if (!listProducts.rows) {
        throw {
          status: 404,
          message: "Product is Empty",
        };
      } else {
        res.status(200).json({
          message: "List Products",
          data: listProducts.rows,
        });
      }
    } catch (err) {
      next(err);
    }
  }

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
      categories.forEach(async (category) => {
        await product_tag.create({
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
      console.log(error);
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
      const filePaths = req.files.map((file) => file.path);

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

      const productUpdate = await product.update(
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
      console.log(productUpdate);
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
      console.log(error);
      next(error);
    }
  }

  static async deleteProduct(req, res, next) {
    try {
      const { id } = req.params;
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
          message: "The product is not yours",
        };
      }
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
      res.status(200).json({
        message: "Offered products",
        data: offeredProducts,
      });
    } catch (err) {
      next(err);
      console.log(error);
      next(error);
    }
  }
}

module.exports = ProductController;
