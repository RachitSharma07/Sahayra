const Notification = require("../models/Notification");

const createNotification = async (req, res) => {
  try {
    const { recipient, message, type } = req.body;

    if (!recipient || !message || !type) {
      return res.status(400).json({
        message: "Recipient, message and type are required",
      });
    }

    const notification = await Notification.create({
      recipient,
      message,
      type,
    });

    return res.status(201).json({
      message: "Notification created successfully",
      notification,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to create notification",
    });
  }
};

const getMyNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({
      recipient: req.user.userId,
    }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      message: "Notifications fetched successfully",
      notifications,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch notifications",
    });
  }
};

const markNotificationAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;

    const notification = await Notification.findOne({
      _id: notificationId,
      recipient: req.user.userId,
    });

    if (!notification) {
      return res.status(404).json({
        message: "Notification not found",
      });
    }

    notification.isRead = true;

    await notification.save();

    return res.status(200).json({
      message: "Notification marked as read",
      notification,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to mark notification as read",
    });
  }
};

module.exports = {
  createNotification,
  getMyNotifications,
  markNotificationAsRead,
};
