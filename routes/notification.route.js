const notificationRouter = require("express").Router();
const NotificationController = require("../controllers/notification.controller");
const isAuth = require("../middlewares/isAuth");
const { param } = require("express-validator");

notificationRouter.get("/", isAuth, NotificationController.getNotification);

notificationRouter.put(
  "/:id",
  isAuth,
  [param("id").isNumeric().withMessage("id must be a number")],
  NotificationController.updateNotification
);

module.exports = notificationRouter;
