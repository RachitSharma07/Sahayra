const express = require("express");

const bookingController = require("../controllers/bookingController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

router.post(
  "/bookings",
  authMiddleware,
  roleMiddleware("customer"),
  bookingController.createBooking,
);

router.get(
  "/bookings",
  authMiddleware,
  roleMiddleware("customer"),
  bookingController.getCustomerBookings,
);

router.get(
  "/provider/bookings",
  authMiddleware,
  roleMiddleware("provider"),
  bookingController.getProviderBookings,
);

router.patch(
  "/bookings/:bookingId/accept",
  authMiddleware,
  roleMiddleware("provider"),
  bookingController.acceptBooking,
);

router.patch(
  "/bookings/:bookingId/reject",
  authMiddleware,
  roleMiddleware("provider"),
  bookingController.rejectBooking,
);

router.patch(
  "/bookings/:bookingId/cancel",
  authMiddleware,
  roleMiddleware("customer"),
  bookingController.cancelBooking,
);

router.patch(
  "/bookings/:bookingId/complete",
  authMiddleware,
  roleMiddleware("provider"),
  bookingController.completeBooking,
);
module.exports = router;
