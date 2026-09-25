const AuditLog = require("../models/AuditLog");
const User = require("../models/User");
const Provider = require("../models/Provider");
const Service = require("../models/Service");
const Booking = require("../models/Booking");
const ReportDownload = require("../models/ReportDownload");
const getDateFilter = (startDate, endDate) => {
  if (!startDate && !endDate) {
    return {};
  }
  const createdAt = {};
  if (startDate) {
    createdAt.$gte = new Date(startDate);
  }
  if (endDate) {
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);
    createdAt.$lte = end;
  }
  return { createdAt };
};
const getActivityReport = async (req, res) => {
  try {
    const { action, entity, userId, startDate, endDate } = req.query;
    const filter = { ...getDateFilter(startDate, endDate) };
    if (action) {
      filter.action = action;
    }
    if (entity) {
      filter.entity = entity;
    }
    if (userId) {
      filter.user = userId;
    }
    const logs = await AuditLog.find(filter)
      .populate("user", "name email role")
      .sort({ createdAt: -1 })
      .lean();
    const report = logs.map((log) => ({
      activityId: log._id,
      date: log.createdAt,
      userName: log.user?.name || "Unknown",
      userEmail: log.user?.email || "Unknown",
      userRole: log.user?.role || "Unknown",
      action: log.action,
      entity: log.entity,
      entityId: log.entityId || "",
      description: log.description,
      ipAddress: log.ipAddress || "",
      userAgent: log.userAgent || "",
      metadata: JSON.stringify(log.metadata || {}),
    }));
    return res
      .status(200)
      .json({
        message: "Activity report generated successfully",
        report,
        totalRecords: report.length,
      });
  } catch (error) {
    console.error("Activity report error:", error);
    return res
      .status(500)
      .json({ message: "Failed to generate activity report" });
  }
};
const getUserReport = async (req, res) => {
  try {
    const users = await User.find({})
      .select("_id name email role status createdAt")
      .sort({ createdAt: -1 })
      .lean();
    const providers = await Provider.find({})
      .select(
        "_id user verificationStatus skills experience location availability",
      )
      .lean();
    const bookings = await Booking.find({})
      .select("customer provider status amount createdAt")
      .lean();
    const services = await Service.find({}).select("provider isActive").lean();
    const providerMap = new Map(
      providers.map((provider) => [provider.user?.toString(), provider]),
    );
    const bookingStats = new Map();
    bookings.forEach((booking) => {
      const customerId = booking.customer?.toString();
      if (!customerId) {
        return;
      }
      if (!bookingStats.has(customerId)) {
        bookingStats.set(customerId, {
          totalBookings: 0,
          completedBookings: 0,
          cancelledBookings: 0,
          rejectedBookings: 0,
          totalAmount: 0,
        });
      }
      const stats = bookingStats.get(customerId);
      stats.totalBookings += 1;
      if (booking.status === "completed") {
        stats.completedBookings += 1;
      }
      if (booking.status === "cancelled") {
        stats.cancelledBookings += 1;
      }
      if (booking.status === "rejected") {
        stats.rejectedBookings += 1;
      }
      stats.totalAmount += Number(booking.amount || 0);
    });
    const providerBookingStats = new Map();
    bookings.forEach((booking) => {
      const providerId = booking.provider?.toString();
      if (!providerId) {
        return;
      }
      if (!providerBookingStats.has(providerId)) {
        providerBookingStats.set(providerId, {
          totalBookings: 0,
          completedBookings: 0,
          totalRevenue: 0,
        });
      }
      const stats = providerBookingStats.get(providerId);
      stats.totalBookings += 1;
      if (booking.status === "completed") {
        stats.completedBookings += 1;
        stats.totalRevenue += Number(booking.amount || 0);
      }
    });
    const providerServiceStats = new Map();
    services.forEach((service) => {
      const providerId = service.provider?.toString();
      if (!providerId) {
        return;
      }
      if (!providerServiceStats.has(providerId)) {
        providerServiceStats.set(providerId, {
          totalServices: 0,
          activeServices: 0,
        });
      }
      const stats = providerServiceStats.get(providerId);
      stats.totalServices += 1;
      if (service.isActive) {
        stats.activeServices += 1;
      }
    });
    const activityCounts = await AuditLog.aggregate([
      { $group: { _id: "$user", activityCount: { $sum: 1 } } },
    ]);
    const activityMap = new Map(
      activityCounts.map((item) => [item._id.toString(), item.activityCount]),
    );
    const report = users.map((user) => {
      const userId = user._id.toString();
      const provider = providerMap.get(userId);
      const bookingStat = bookingStats.get(userId) || {
        totalBookings: 0,
        completedBookings: 0,
        cancelledBookings: 0,
        rejectedBookings: 0,
        totalAmount: 0,
      };
      const providerId = provider?._id?.toString();
      const providerBookingStat = providerBookingStats.get(providerId) || {
        totalBookings: 0,
        completedBookings: 0,
        totalRevenue: 0,
      };
      const providerServiceStat = providerServiceStats.get(providerId) || {
        totalServices: 0,
        activeServices: 0,
      };
      return {
        userId: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status || "active",
        createdAt: user.createdAt,
        activityCount: activityMap.get(userId) || 0,
        totalBookings: bookingStat.totalBookings,
        completedBookings: bookingStat.completedBookings,
        cancelledBookings: bookingStat.cancelledBookings,
        rejectedBookings: bookingStat.rejectedBookings,
        totalBookingAmount: bookingStat.totalAmount,
        providerVerificationStatus: provider?.verificationStatus || "",
        providerExperience: provider?.experience || "",
        providerLocation: provider?.location || "",
        providerAvailability: provider?.availability || "",
        providerTotalBookings: providerBookingStat.totalBookings,
        providerCompletedBookings: providerBookingStat.completedBookings,
        providerRevenue: providerBookingStat.totalRevenue,
        providerTotalServices: providerServiceStat.totalServices,
        providerActiveServices: providerServiceStat.activeServices,
      };
    });
    return res
      .status(200)
      .json({
        message: "User report generated successfully",
        report,
        totalRecords: report.length,
      });
  } catch (error) {
    console.error("User report error:", error);
    return res.status(500).json({ message: "Failed to generate user report" });
  }
};
const buildBookingFilter = ({
  startDate,
  endDate,
  status,
  paymentStatus,
  providerId,
  customerId,
  serviceId,
}) => {
  const filter = { ...getDateFilter(startDate, endDate) };
  if (status) {
    filter.status = status;
  }
  if (paymentStatus) {
    filter.paymentStatus = paymentStatus;
  }
  if (providerId) {
    filter.provider = providerId;
  }
  if (customerId) {
    filter.customer = customerId;
  }
  if (serviceId) {
    filter.service = serviceId;
  }
  return filter;
};
const getBookingReport = async (req, res) => {
  try {
    const filter = buildBookingFilter(req.query);
    const bookings = await Booking.find(filter)
      .populate("customer", "name email")
      .populate("provider", "user skills experience location")
      .populate({
        path: "provider",
        populate: { path: "user", select: "name email" },
      })
      .populate({
        path: "service",
        populate: { path: "category", select: "name" },
      })
      .sort({ createdAt: -1 })
      .lean();
    const report = bookings.map((booking) => ({
      bookingId: booking._id,
      customerName: booking.customer?.name || "",
      customerEmail: booking.customer?.email || "",
      providerName: booking.provider?.user?.name || "",
      providerEmail: booking.provider?.user?.email || "",
      serviceName: booking.service?.name || "",
      categoryName: booking.service?.category?.name || "",
      bookingDate: booking.bookingDate || "",
      status: booking.status || "",
      amount: Number(booking.amount || 0),
      paymentStatus: booking.paymentStatus || "",
      createdAt: booking.createdAt || "",
      updatedAt: booking.updatedAt || "",
    }));
    return res
      .status(200)
      .json({
        message: "Booking report generated successfully",
        report,
        totalRecords: report.length,
      });
  } catch (error) {
    console.error("Booking report error:", error);
    return res
      .status(500)
      .json({ message: "Failed to generate booking report" });
  }
};
const createReportDownload = async (req, res) => {
  try {
    const {
      reportType,
      fileName,
      filters = {},
      columns = [],
      recordCount = 0,
    } = req.body;
    const allowedTypes = [
      "ACTIVITY",
      "USER",
      "PERSONALIZED_BOOKING",
      "STANDARD_MIS",
    ];
    if (!allowedTypes.includes(reportType)) {
      return res.status(400).json({ message: "Invalid report type" });
    }
    const download = await ReportDownload.create({
      user: req.user.userId,
      reportType,
      fileName,
      filters,
      columns,
      recordCount,
    });
    return res
      .status(201)
      .json({ message: "Report download recorded", download });
  } catch (error) {
    console.error("Create report download error:", error);
    return res
      .status(500)
      .json({ message: "Failed to record report download" });
  }
};
const getReportDownloadHistory = async (req, res) => {
  try {
    const downloads = await ReportDownload.find({})
      .populate("user", "name email role")
      .sort({ createdAt: -1 })
      .limit(100)
      .lean();
    return res
      .status(200)
      .json({
        message: "Report download history fetched successfully",
        downloads,
      });
  } catch (error) {
    console.error("Report download history error:", error);
    return res
      .status(500)
      .json({ message: "Failed to fetch report download history" });
  }
};
module.exports = {
  getActivityReport,
  getUserReport,
  getBookingReport,
  createReportDownload,
  getReportDownloadHistory,
};
