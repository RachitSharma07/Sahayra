const mongoose = require("mongoose");

const transactionSchema = mongoose.Schema(
  {
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true
    },

    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    provider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Provider",
      required: true
    },

    amount: {
      type: Number,
      required: true,
      min: 0
    },

    razorpayOrderId: {
      type: String,
      required: true
    },

    razorpayPaymentId: {
      type: String,
      required: true
    },

    status: {
      type: String,
      enum: ["success", "failed"],
      default: "success"
    }
  },
  {
    timestamps: true
  }
);

transactionSchema.index({ booking: 1 });
transactionSchema.index({ razorpayOrderId: 1 });
transactionSchema.index({ razorpayPaymentId: 1 });

const Transaction = mongoose.model(
  "Transaction",
  transactionSchema
);

module.exports = Transaction;