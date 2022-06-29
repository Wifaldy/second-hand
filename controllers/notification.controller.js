const { notification, offer, product } = require("../models");
const { validationResult } = require("express-validator");

class NotificationController {
  static async getNotification(req, res, next) {
    try {
      const findNotification = await notification.findAll({
        include: [{ model: offer }, { model: product }],
        where: {
          user_id: req.user.id,
        },
      });
      if (!notification) {
        throw {
          status: 404,
          message: "Notification data is empty",
        };
      }
      res.status(200).json({
        message: "Success get all notification",
        findNotification,
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateNotification(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw {
          status: 400,
          message: errors.array()[0].msg,
        };
      }
      const { id } = req.params;
      const findNotification = await notification.findOne({
        where: {
          id: id,
        },
      });
      if (!findNotification) {
        throw {
          status: 404,
          message: "Notification not found",
        };
      }
      await notification.update(
        {
          status: "read",
        },
        {
          where: {
            id: id,
          },
        }
      );
      res.status(200).json({
        message: "Success update notification",
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = NotificationController;
