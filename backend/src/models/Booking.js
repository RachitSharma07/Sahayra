const mongoose = require("mongoose");

const bookingSchema = mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    provider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Provider",
      required: true,
    },

    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },

    bookingDate: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: [
        "pending",
        "accepted",
        "rejected",
        "cancelled",
        "completed",
      ],
      default: "pending",
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  },
);

bookingSchema.index({ customer: 1, bookingDate: -1 });
bookingSchema.index({ provider: 1, bookingDate: -1 });
bookingSchema.index({ status: 1, bookingDate: -1 });
bookingSchema.index({ paymentStatus: 1, bookingDate: -1 });
bookingSchema.index({ bookingDate: -1 });

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;