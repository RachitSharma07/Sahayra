const mongoose = require("mongoose");
const Review = require("../models/Review");
const Booking = require("../models/Booking");

const createReview = async (req, res) => {
  try {
    const { bookingId, rating, comment } = req.body;

    if (!bookingId || !rating) {
      return res.status(400).json({
        message: "Booking ID and rating are required",
      });
    }

    // Find booking made by the logged-in customer
    const booking = await Booking.findOne({
      _id: bookingId,
      customer: req.user.userId,
    });

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    // Review only completed bookings
    if (booking.status !== "completed") {
      return res.status(400).json({
        message: "You can review only completed bookings",
      });
    }

    // Check whether this booking already has a review
    const existingReview = await Review.findOne({
      booking: booking._id,
    });

    if (existingReview) {
      return res.status(400).json({
        message: "This booking has already been reviewed",
      });
    }

    // Create review using trusted booking data
    const review = await Review.create({
      customer: booking.customer,
      provider: booking.provider,
      service: booking.service,
      booking: booking._id,
      rating,
      comment,
    });

    return res.status(201).json({
      message: "Review created successfully",
      review,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to create review",
    });
  }
};

const getProviderAverageRating = async (req, res) => {
  try {
    const { providerId } = req.params;

    const result = await Review.aggregate([
      {
        $match: {
          provider: new mongoose.Types.ObjectId(providerId),
        },
      },
      {
        $group: {
          _id: "$provider",
          averageRating: { $avg: "$rating" },
          totalReviews: { $sum: 1 },
        },
      },
    ]);

    if (result.length === 0) {
      return res.status(200).json({
        averageRating: 0,
        totalReviews: 0,
      });
    }

    return res.status(200).json({
      averageRating: Number(result[0].averageRating.toFixed(2)),
      totalReviews: result[0].totalReviews,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to calculate average rating",
    });
  }
};

module.exports = {
  createReview,
  getProviderAverageRating,
};
