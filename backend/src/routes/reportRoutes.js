const express = require("express");
const router = express.Router();
const reportController = require("../controllers/reportController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
router.get(
  "/activity",
  authMiddleware,
  roleMiddleware("admin"),
  reportController.getActivityReport,
);
router.get(
  "/users",
  authMiddleware,
  roleMiddleware("admin"),
  reportController.getUserReport,
);
router.get(
  "/bookings",
  authMiddleware,
  roleMiddleware("admin"),
  reportController.getBookingReport,
);
router.post(
  "/downloads",
  authMiddleware,
  roleMiddleware("admin"),
  reportController.createReportDownload,
);
router.get(
  "/downloads",
  authMiddleware,
  roleMiddleware("admin"),
  reportController.getReportDownloadHistory,
);
module.exports = router;
