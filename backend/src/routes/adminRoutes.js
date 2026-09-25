const express = require("express");

const router = express.Router();

const adminController = require("../controllers/adminController");

const authMiddleware = require("../middleware/authMiddleware");

const roleMiddleware = require("../middleware/roleMiddleware");

router.get(
  "/dashboard",
  authMiddleware,
  roleMiddleware("admin"),
  adminController.getAdminDashboard,
);

router.get(
  "/users",
  authMiddleware,
  roleMiddleware("admin"),
  adminController.getAllUsers,
);

router.post(
  "/users",
  authMiddleware,
  roleMiddleware("admin"),
  adminController.createUser,
);

router.patch(
  "/users/:userId/status",
  authMiddleware,
  roleMiddleware("admin"),
  adminController.updateUserStatus,
);

router.get(
  "/providers",
  authMiddleware,
  roleMiddleware("admin"),
  adminController.getAllProviders,
);

router.patch(
  "/providers/:providerId/verification",
  authMiddleware,
  roleMiddleware("admin"),
  adminController.updateProviderVerification,
);

router.get(
  "/bookings",
  authMiddleware,
  roleMiddleware("admin"),
  adminController.getAllBookings,
);

router.patch(
  "/bookings/:bookingId/status",
  authMiddleware,
  roleMiddleware("admin"),
  adminController.updateBookingStatus,
);

router.get(
  "/services",
  authMiddleware,
  roleMiddleware("admin"),
  adminController.getAllServices,
);

router.patch(
  "/services/:serviceId/status",
  authMiddleware,
  roleMiddleware("admin"),
  adminController.updateServiceStatus,
);

router.get(
  "/statistics",
  authMiddleware,
  roleMiddleware("admin"),
  adminController.getAdminStatistics,
);

router.get(
  "/audit-logs",
  authMiddleware,
  roleMiddleware("admin"),
  adminController.getAuditLogs,
);

module.exports = router;
