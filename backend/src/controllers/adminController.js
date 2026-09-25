const User = require("../models/User");
const Provider = require("../models/Provider");
const Service = require("../models/Service");
const Booking = require("../models/Booking");
const AuditLog = require("../models/AuditLog");
const { createAuditLog } = require("./auditLogController");

const getAdminDashboard = async (req, res) => {
  try {
    const [
      totalUsers,
      totalProviders,
      totalServices,
      totalBookings,
      pendingBookings,
      completedBookings,
      revenueResult,
    ] = await Promise.all([
      User.countDocuments(),
      Provider.countDocuments(),
      Service.countDocuments({
        isActive: true,
      }),
      Booking.countDocuments(),
      Booking.countDocuments({
        status: "pending",
      }),
      Booking.countDocuments({
        status: "completed",
      }),
      Booking.aggregate([
        {
          $match: {
            status: "completed",
            paymentStatus: "paid",
          },
        },
        {
          $group: {
            _id: null,
            totalRevenue: {
              $sum: "$amount",
            },
          },
        },
      ]),
    ]);

    const totalRevenue =
      revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;

    return res.status(200).json({
      message: "Admin dashboard fetched successfully",
      dashboard: {
        totalUsers,
        totalProviders,
        totalServices,
        totalBookings,
        pendingBookings,
        completedBookings,
        totalRevenue,
      },
    });
  } catch (error) {
    console.error("Admin dashboard error:", error);

    return res.status(500).json({
      message: "Failed to fetch admin dashboard",
    });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20, search = "", status = "all" } = req.query;

    const currentPage = Math.max(Number(page), 1);
    const currentLimit = Math.min(Math.max(Number(limit), 1), 100);

    const skip = (currentPage - 1) * currentLimit;

    const filter = {};

    if (search.trim()) {
      const searchRegex = new RegExp(search.trim(), "i");

      filter.$or = [
        { name: searchRegex },
        { email: searchRegex },
        { role: searchRegex },
      ];
    }

    if (status === "active") {
      filter.isActive = true;
    }

    if (status === "inactive") {
      filter.isActive = false;
    }

    const [users, totalUsers] = await Promise.all([
      User.find(filter)
        .select("name email role isActive isVerified createdAt updatedAt")
        .sort({
          createdAt: -1,
        })
        .skip(skip)
        .limit(currentLimit)
        .lean(),

      User.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(totalUsers / currentLimit);

    return res.status(200).json({
      message: "Users fetched successfully",
      users,
      pagination: {
        currentPage,
        limit: currentLimit,
        totalUsers,
        totalPages,
      },
    });
  } catch (error) {
    console.error("Get all users error:", error);

    return res.status(500).json({
      message: "Failed to fetch users",
    });
  }
};

const createUser = async (req, res) => {
  try {
    const { name, email, password, role, isActive = true } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({
        message: "Name, email, password and role are required",
      });
    }

    const allowedRoles = ["customer", "provider", "admin"];

    if (!allowedRoles.includes(role)) {
      return res.status(400).json({
        message: "Invalid user role",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return res.status(409).json({
        message: "User with this email already exists",
      });
    }

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password,
      role,
      isActive,
    });

    await createAuditLog({
      user: req.user.userId,
      action: "CREATE_USER",
      entity: "User",
      entityId: user._id,
      description: "Admin created a new user",
      req,
      metadata: {
        targetUserId: user._id,
        role: user.role,
        isActive: user.isActive,
      },
    });

    return res.status(201).json({
      message: "User created successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("Create user error:", error);

    return res.status(500).json({
      message: "Failed to create user",
    });
  }
};

const updateUserStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const { isActive } = req.body;

    if (typeof isActive !== "boolean") {
      return res.status(400).json({
        message: "isActive must be true or false",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const previousStatus = user.isActive;

    user.isActive = isActive;

    await user.save();

    await createAuditLog({
      user: req.user.userId,
      action: "UPDATE_USER_STATUS",
      entity: "User",
      entityId: user._id,
      description: "Admin updated user active status",
      req,
      metadata: {
        targetUserId: user._id,
        previousStatus,
        newStatus: isActive,
      },
    });

    return res.status(200).json({
      message: "User status updated successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
      },
    });
  } catch (error) {
    console.error("Update user status error:", error);

    return res.status(500).json({
      message: "Failed to update user status",
    });
  }
};

const getAllProviders = async (req, res) => {
  try {
    const { page = 1, limit = 20, search = "", status = "all" } = req.query;

    const currentPage = Math.max(Number(page), 1);
    const currentLimit = Math.min(Math.max(Number(limit), 1), 100);

    const skip = (currentPage - 1) * currentLimit;

    const filter = {};

    if (status !== "all") {
      filter.verificationStatus = status;
    }

    if (search.trim()) {
      const searchRegex = new RegExp(search.trim(), "i");

      const matchingUsers = await User.find({
        $or: [{ name: searchRegex }, { email: searchRegex }],
      }).select("_id");

      filter.$or = [
        { user: { $in: matchingUsers.map((user) => user._id) } },
        { location: searchRegex },
        { skills: searchRegex },
      ];
    }

    const [providers, totalProviders] = await Promise.all([
      Provider.find(filter)
        .select(
          "user skills experience location availability verificationStatus profileImage createdAt updatedAt",
        )
        .populate("user", "name email role isActive")
        .sort({
          createdAt: -1,
        })
        .skip(skip)
        .limit(currentLimit)
        .lean(),

      Provider.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(totalProviders / currentLimit);

    return res.status(200).json({
      message: "Providers fetched successfully",
      providers,
      pagination: {
        currentPage,
        limit: currentLimit,
        totalProviders,
        totalPages,
      },
    });
  } catch (error) {
    console.error("Get all providers error:", error);

    return res.status(500).json({
      message: "Failed to fetch providers",
    });
  }
};

const updateProviderVerification = async (req, res) => {
  try {
    const { providerId } = req.params;
    const { verificationStatus } = req.body;

    if (!["pending", "verified", "rejected"].includes(verificationStatus)) {
      return res.status(400).json({
        message: "Invalid verification status",
      });
    }

    const provider = await Provider.findById(providerId);

    if (!provider) {
      return res.status(404).json({
        message: "Provider not found",
      });
    }

    const previousStatus = provider.verificationStatus;

    provider.verificationStatus = verificationStatus;

    await provider.save();

    await createAuditLog({
      user: req.user.userId,
      action: "UPDATE_PROVIDER_VERIFICATION",
      entity: "Provider",
      entityId: provider._id,
      description: "Admin updated provider verification status",
      req,
      metadata: {
        previousStatus,
        newStatus: verificationStatus,
      },
    });

    return res.status(200).json({
      message: "Provider verification status updated successfully",
      provider,
    });
  } catch (error) {
    console.error("Update provider verification error:", error);

    return res.status(500).json({
      message: "Failed to update provider verification",
    });
  }
};

const getAllBookings = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;

    const currentPage = Math.max(Number(page), 1);
    const currentLimit = Math.min(Math.max(Number(limit), 1), 100);

    const skip = (currentPage - 1) * currentLimit;

    const [bookings, totalBookings] = await Promise.all([
      Booking.find()
        .select(
          "customer provider service bookingDate status amount paymentStatus createdAt updatedAt",
        )
        .populate("customer", "name email")
        .populate({
          path: "provider",
          select: "user skills location availability verificationStatus",
          populate: {
            path: "user",
            select: "name email role isActive",
          },
        })
        .populate("service", "name price duration category")
        .populate("service.category", "name description")
        .sort({
          createdAt: -1,
        })
        .skip(skip)
        .limit(currentLimit)
        .lean(),

      Booking.countDocuments(),
    ]);

    const totalPages = Math.ceil(totalBookings / currentLimit);

    return res.status(200).json({
      message: "Bookings fetched successfully",
      bookings,
      pagination: {
        currentPage,
        limit: currentLimit,
        totalBookings,
        totalPages,
      },
    });
  } catch (error) {
    console.error("Get all bookings error:", error);

    return res.status(500).json({
      message: "Failed to fetch bookings",
    });
  }
};

const updateBookingStatus = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { status } = req.body;

    const allowedStatuses = [
      "pending",
      "accepted",
      "rejected",
      "cancelled",
      "completed",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid booking status",
      });
    }

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    const previousStatus = booking.status;

    booking.status = status;

    await booking.save();

    await createAuditLog({
      user: req.user.userId,
      action: "UPDATE_BOOKING_STATUS",
      entity: "Booking",
      entityId: booking._id,
      description: "Admin updated booking status",
      req,
      metadata: {
        previousStatus,
        newStatus: status,
      },
    });

    return res.status(200).json({
      message: "Booking status updated successfully",
      booking,
    });
  } catch (error) {
    console.error("Update booking status error:", error);

    return res.status(500).json({
      message: "Failed to update booking status",
    });
  }
};

const getAllServices = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;

    const currentPage = Math.max(Number(page), 1);
    const currentLimit = Math.min(Math.max(Number(limit), 1), 100);

    const skip = (currentPage - 1) * currentLimit;

    const [services, totalServices] = await Promise.all([
      Service.find()
        .select(
          "provider name description price duration category isActive images createdAt updatedAt",
        )
        .populate("category", "name description")
        .populate({
          path: "provider",
          select:
            "user skills experience location availability verificationStatus",
          populate: {
            path: "user",
            select: "name email role isActive",
          },
        })
        .sort({
          createdAt: -1,
        })
        .skip(skip)
        .limit(currentLimit)
        .lean(),

      Service.countDocuments(),
    ]);

    const totalPages = Math.ceil(totalServices / currentLimit);

    return res.status(200).json({
      message: "Services fetched successfully",
      services,
      pagination: {
        currentPage,
        limit: currentLimit,
        totalServices,
        totalPages,
      },
    });
  } catch (error) {
    console.error("Get all services error:", error);

    return res.status(500).json({
      message: "Failed to fetch services",
    });
  }
};

const updateServiceStatus = async (req, res) => {
  try {
    const { serviceId } = req.params;
    const { isActive } = req.body;

    if (typeof isActive !== "boolean") {
      return res.status(400).json({
        message: "isActive must be true or false",
      });
    }

    const service = await Service.findById(serviceId);

    if (!service) {
      return res.status(404).json({
        message: "Service not found",
      });
    }

    const previousStatus = service.isActive;

    service.isActive = isActive;

    await service.save();

    await createAuditLog({
      user: req.user.userId,
      action: "UPDATE_SERVICE_STATUS",
      entity: "Service",
      entityId: service._id,
      description: "Admin updated service active status",
      req,
      metadata: {
        previousStatus,
        newStatus: isActive,
        serviceName: service.name,
      },
    });

    return res.status(200).json({
      message: "Service status updated successfully",
      service,
    });
  } catch (error) {
    console.error("Update service status error:", error);

    return res.status(500).json({
      message: "Failed to update service status",
    });
  }
};

const getAdminStatistics = async (req, res) => {
  try {
    const [
      totalUsers,
      totalProviders,
      verifiedProviders,
      pendingProviders,
      rejectedProviders,
      totalServices,
      activeServices,
      inactiveServices,
      totalBookings,
      pendingBookings,
      acceptedBookings,
      rejectedBookings,
      cancelledBookings,
      completedBookings,
      revenueResult,
      paidBookings,
      unpaidBookings,
    ] = await Promise.all([
      User.countDocuments(),

      Provider.countDocuments(),

      Provider.countDocuments({
        verificationStatus: "verified",
      }),

      Provider.countDocuments({
        verificationStatus: "pending",
      }),

      Provider.countDocuments({
        verificationStatus: "rejected",
      }),

      Service.countDocuments(),

      Service.countDocuments({
        isActive: true,
      }),

      Service.countDocuments({
        isActive: false,
      }),

      Booking.countDocuments(),

      Booking.countDocuments({
        status: "pending",
      }),

      Booking.countDocuments({
        status: "accepted",
      }),

      Booking.countDocuments({
        status: "rejected",
      }),

      Booking.countDocuments({
        status: "cancelled",
      }),

      Booking.countDocuments({
        status: "completed",
      }),

      Booking.aggregate([
        {
          $match: {
            status: "completed",
            paymentStatus: "paid",
          },
        },
        {
          $group: {
            _id: null,
            totalRevenue: {
              $sum: "$amount",
            },
          },
        },
      ]),

      Booking.countDocuments({
        paymentStatus: "paid",
      }),

      Booking.countDocuments({
        paymentStatus: {
          $ne: "paid",
        },
      }),
    ]);

    const totalRevenue =
      revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;

    return res.status(200).json({
      message: "Admin statistics fetched successfully",
      statistics: {
        users: {
          total: totalUsers,
        },

        providers: {
          total: totalProviders,
          verified: verifiedProviders,
          pending: pendingProviders,
          rejected: rejectedProviders,
        },

        services: {
          total: totalServices,
          active: activeServices,
          inactive: inactiveServices,
        },

        bookings: {
          total: totalBookings,
          pending: pendingBookings,
          accepted: acceptedBookings,
          rejected: rejectedBookings,
          cancelled: cancelledBookings,
          completed: completedBookings,
        },

        payments: {
          paidBookings,
          unpaidBookings,
          totalRevenue,
        },
      },
    });
  } catch (error) {
    console.error("Admin statistics error:", error);

    return res.status(500).json({
      message: "Failed to fetch admin statistics",
    });
  }
};

const getAuditLogs = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      action,
      entity,
      userId,
      startDate,
      endDate,
    } = req.query;

    const currentPage = Math.max(Number(page), 1);
    const currentLimit = Math.min(Math.max(Number(limit), 1), 100);

    const skip = (currentPage - 1) * currentLimit;

    const filter = {};

    if (action) {
      filter.action = action;
    }

    if (entity) {
      filter.entity = entity;
    }

    if (userId) {
      filter.user = userId;
    }

    if (startDate || endDate) {
      filter.createdAt = {};

      if (startDate) {
        filter.createdAt.$gte = new Date(startDate);
      }

      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        filter.createdAt.$lte = end;
      }
    }

    const [logs, totalLogs] = await Promise.all([
      AuditLog.find(filter)
        .populate("user", "name email role")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(currentLimit)
        .lean(),

      AuditLog.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(totalLogs / currentLimit);

    return res.status(200).json({
      message: "Audit logs fetched successfully",
      logs,
      pagination: {
        currentPage,
        limit: currentLimit,
        totalLogs,
        totalPages,
      },
    });
  } catch (error) {
    console.error("Get audit logs error:", error);

    return res.status(500).json({
      message: "Failed to fetch audit logs",
    });
  }
};

module.exports = {
  getAdminDashboard,
  getAllUsers,
  createUser,
  updateUserStatus,
  getAllProviders,
  updateProviderVerification,
  getAllBookings,
  updateBookingStatus,
  getAllServices,
  updateServiceStatus,
  getAdminStatistics,
  getAuditLogs,
};
