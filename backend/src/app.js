const express = require("express");

const app = express();

const cors = require("cors");
const userRoutes = require("./routes/userRoutes");
const testRoutes = require("./routes/testRoutes");
const loggerMiddleware = require("./middleware/loggerMiddleware");
const authRoutes = require("./routes/authRoutes");
const providerRoutes = require("./routes/providerRoutes");
const serviceCategoryRoutes = require("./routes/serviceCategoryRoutes");
const serviceRoutes = require("./routes/serviceRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const messageRoutes = require("./routes/messageRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const adminRoutes = require("./routes/adminRoutes");
const reportRoutes = require("./routes/reportRoutes");
app.use(express.json());

const allowedOrigins = process.env.FRONTEND_URLS.split(",");

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);
app.use(loggerMiddleware);
app.use("/api", testRoutes);
app.use("/api", userRoutes);
app.use("/api", authRoutes);
app.use("/api", providerRoutes);
app.use("/api", serviceCategoryRoutes);
app.use("/api", serviceRoutes);
app.use("/api", bookingRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/notifications", notificationRoutes);
app.use("/messages", messageRoutes);
app.use("/upload", uploadRoutes);
app.use("/payments", paymentRoutes);
app.use("/admin", adminRoutes);
app.use("/api/admin/reports", reportRoutes);
module.exports = app;
