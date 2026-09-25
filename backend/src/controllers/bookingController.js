const Booking = require("../models/Booking");
const Service = require("../models/Service");
const Provider = require("../models/Provider");
const Notification = require("../models/Notification");
const { createAuditLog } = require("./auditLogController");
const createBooking = async (req, res) => {
  try {
    const { serviceId, bookingDate } = req.body;
    if (!serviceId || !bookingDate) {
      return res
        .status(400)
        .json({ message: "Service ID and booking date are required" });
    }
    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }
    const provider = await Provider.findById(service.provider);
    if (!provider) {
      return res.status(404).json({ message: "Provider not found" });
    }
    const booking = await Booking.create({
      customer: req.user.userId,
      provider: provider._id,
      service: service._id,
      bookingDate,
      amount: service.price,
    });
    await createAuditLog({
      user: req.user.userId,
      action: "CREATE_BOOKING",
      entity: "Booking",
      entityId: booking._id,
      description: "Customer created a new booking",
      req,
      metadata: {
        serviceId: service._id,
        providerId: provider._id,
        bookingDate,
        amount: service.price,
      },
    });
    await Notification.create({
      recipient: provider.user,
      message: "You have received a new booking request",
      type: "booking",
    });
    return res
      .status(201)
      .json({ message: "Booking created successfully", booking });
  } catch (error) {
    return res.status(500).json({ message: "Failed to create booking" });
  }
};
const getCustomerBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ customer: req.user.userId })
      .populate("service", "name description price duration category images")
      .populate({
        path: "provider",
        select:
          "user skills experience location availability verificationStatus profileImage",
        populate: { path: "user", select: "name email role" },
      })
      .sort({ createdAt: -1 });
    return res
      .status(200)
      .json({ message: "Customer bookings fetched successfully", bookings });
  } catch (error) {
    console.error("Get customer bookings error:", error);
    return res
      .status(500)
      .json({ message: "Failed to fetch customer bookings" });
  }
};
const getProviderBookings = async (req, res) => {
  try {
    const provider = await Provider.findOne({ user: req.user.userId });
    if (!provider) {
      return res.status(404).json({ message: "Provider profile not found" });
    }
    const bookings = await Booking.find({ provider: provider._id })
      .populate({ path: "customer", select: "name email role" })
      .populate({
        path: "service",
        select: "name description price duration category images",
        populate: { path: "category", select: "name description" },
      })
      .sort({ createdAt: -1 });
    return res
      .status(200)
      .json({ message: "Provider bookings fetched successfully", bookings });
  } catch (error) {
    console.error("Get provider bookings error:", error);
    return res
      .status(500)
      .json({ message: "Failed to fetch provider bookings" });
  }
};
const acceptBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const provider = await Provider.findOne({ user: req.user.userId });
    if (!provider) {
      return res.status(404).json({ message: "Provider profile not found" });
    }
    const booking = await Booking.findOne({
      _id: bookingId,
      provider: provider._id,
    });
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    if (booking.status !== "pending") {
      return res
        .status(400)
        .json({ message: "Only pending bookings can be accepted" });
    }
    booking.status = "accepted";
    await booking.save();
    await createAuditLog({
      user: req.user.userId,
      action: "UPDATE_BOOKING",
      entity: "Booking",
      entityId: booking._id,
      description: "Provider accepted a booking",
      req,
      metadata: { previousStatus: "pending", newStatus: "accepted" },
    });
    await Notification.create({
      recipient: booking.customer,
      message: "Your booking has been accepted",
      type: "booking",
    });
    return res
      .status(200)
      .json({ message: "Booking accepted successfully", booking });
  } catch (error) {
    return res.status(500).json({ message: "Failed to accept booking" });
  }
};
const rejectBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const provider = await Provider.findOne({ user: req.user.userId });
    if (!provider) {
      return res.status(404).json({ message: "Provider profile not found" });
    }
    const booking = await Booking.findOne({
      _id: bookingId,
      provider: provider._id,
    });
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    if (booking.status !== "pending") {
      return res
        .status(400)
        .json({ message: "Only pending bookings can be rejected" });
    }
    booking.status = "rejected";
    await booking.save();
    await createAuditLog({
      user: req.user.userId,
      action: "UPDATE_BOOKING",
      entity: "Booking",
      entityId: booking._id,
      description: "Provider rejected a booking",
      req,
      metadata: { previousStatus: "pending", newStatus: "rejected" },
    });
    await Notification.create({
      recipient: booking.customer,
      message: "Your booking has been rejected",
      type: "booking",
    });
    return res
      .status(200)
      .json({ message: "Booking rejected successfully", booking });
  } catch (error) {
    return res.status(500).json({ message: "Failed to reject booking" });
  }
};
const cancelBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const booking = await Booking.findOne({
      _id: bookingId,
      customer: req.user.userId,
    });
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    if (!["pending", "accepted"].includes(booking.status)) {
      return res
        .status(400)
        .json({ message: "This booking cannot be cancelled" });
    }
    const previousStatus = booking.status;
    booking.status = "cancelled";
    await booking.save();
    await createAuditLog({
      user: req.user.userId,
      action: "CANCEL_BOOKING",
      entity: "Booking",
      entityId: booking._id,
      description: "Customer cancelled a booking",
      req,
      metadata: { previousStatus, newStatus: "cancelled" },
    });
    const provider = await Provider.findById(booking.provider);
    if (provider) {
      await Notification.create({
        recipient: provider.user,
        message: "A customer has cancelled a booking",
        type: "booking",
      });
    }
    return res
      .status(200)
      .json({ message: "Booking cancelled successfully", booking });
  } catch (error) {
    return res.status(500).json({ message: "Failed to cancel booking" });
  }
};
const completeBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const provider = await Provider.findOne({ user: req.user.userId });
    if (!provider) {
      return res.status(404).json({ message: "Provider profile not found" });
    }
    const booking = await Booking.findOne({
      _id: bookingId,
      provider: provider._id,
    });
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    if (booking.status !== "accepted") {
      return res
        .status(400)
        .json({ message: "Only accepted bookings can be completed" });
    }
    booking.status = "completed";
    await booking.save();
    await createAuditLog({
      user: req.user.userId,
      action: "UPDATE_BOOKING",
      entity: "Booking",
      entityId: booking._id,
      description: "Provider completed a booking",
      req,
      metadata: { previousStatus: "accepted", newStatus: "completed" },
    });
    await Notification.create({
      recipient: booking.customer,
      message: "Your booking has been completed",
      type: "booking",
    });
    return res
      .status(200)
      .json({ message: "Booking completed successfully", booking });
  } catch (error) {
    return res.status(500).json({ message: "Failed to complete booking" });
  }
};
module.exports = {
  createBooking,
  getCustomerBookings,
  getProviderBookings,
  acceptBooking,
  rejectBooking,
  cancelBooking,
  completeBooking,
};
