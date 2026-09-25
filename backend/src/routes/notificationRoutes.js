const express = require("express");

const router = express.Router();

const notificationController = require("../controllers/notificationController");

const authMiddleware = require("../middleware/authMiddleware");

router.get("/", authMiddleware, notificationController.getMyNotifications);

router.patch(
  "/:notificationId/read",
  authMiddleware,
  notificationController.markNotificationAsRead,
);

module.exports = router;
    