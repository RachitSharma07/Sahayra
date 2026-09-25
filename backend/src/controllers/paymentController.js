const razorpay = require("../config/razorpay");
const Booking = require("../models/Booking");
const Transaction = require("../models/Transaction");
const createPayment = async (req, res) => {
  try {
    const { bookingId } = req.params;

    // Find booking
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    // Check booking belongs to logged-in customer
    if (booking.customer.toString() !== req.user.userId.toString()) {
      return res.status(403).json({
        message: "You are not authorized to pay for this booking",
      });
    }

    // Check if already paid
    if (booking.paymentStatus === "paid") {
      return res.status(400).json({
        message: "Booking is already paid",
      });
    }

    // Amount must be greater than 0
    if (!booking.amount || booking.amount <= 0) {
      return res.status(400).json({
        message: "Invalid booking amount",
      });
    }

    // Razorpay amount is in paise
    const options = {
      amount: Math.round(booking.amount * 100),
      currency: "INR",
      receipt: `booking_${booking._id}`,
    };

    const order = await razorpay.orders.create(options);

    return res.status(201).json({
      message: "Payment order created successfully",
      order: {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
      },
    });
  } catch (error) {
    console.error("Create payment error:", error);

    return res.status(500).json({
      message: "Failed to create payment order",
    });
  }
};

const crypto = require("crypto");

const verifyPayment = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    // 1. Find booking
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    // 2. Check booking belongs to logged-in customer
    if (booking.customer.toString() !== req.user.userId.toString()) {
      return res.status(403).json({
        message: "You are not authorized to verify this payment",
      });
    }

    // 3. Create signature
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    // 4. Compare signatures
    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({
        message: "Payment verification failed",
      });
    }

    // 5. Mark booking as paid
    booking.paymentStatus = "paid";

    await booking.save();
    const transaction = await Transaction.create({
      booking: booking._id,
      customer: booking.customer,
      provider: booking.provider,
      amount: booking.amount,
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      status: "success",
    });

    // 6. Response
    return res.status(200).json({
      message: "Payment verified successfully",
      booking,
      transaction,
    });
  } catch (error) {
    console.error("Payment verification error:", error);

    return res.status(500).json({
      message: "Failed to verify payment",
    });
  }
};

const getPaymentHistory = async (req, res) => {
  try {
    const transactions = await Transaction.find({
      customer: req.user.userId,
    })
      .populate("booking", "bookingDate status")
      .populate("provider", "skills experience location")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Payment history fetched successfully",
      transactions,
    });
  } catch (error) {
    console.error("Payment history error:", error);

    return res.status(500).json({
      message: "Failed to fetch payment history",
    });
  }
};

module.exports = {
  createPayment,
  verifyPayment,
  getPaymentHistory,
};
