const express = require("express");

const router = express.Router();

const paymentController = require("../controllers/paymentController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/:bookingId", authMiddleware, paymentController.createPayment);
router.get("/history", authMiddleware, paymentController.getPaymentHistory);

module.exports = router;
