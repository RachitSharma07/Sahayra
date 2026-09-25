const mongoose = require("mongoose");
const reportDownloadSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    reportType: {
      type: String,
      required: true,
      enum: ["ACTIVITY", "USER", "PERSONALIZED_BOOKING", "STANDARD_MIS"],
    },
    fileName: { type: String, required: true },
    filters: { type: mongoose.Schema.Types.Mixed, default: {} },
    columns: { type: [String], default: [] },
    recordCount: { type: Number, default: 0 },
  },
  { timestamps: true },
);
reportDownloadSchema.index({ user: 1, createdAt: -1 });
reportDownloadSchema.index({ reportType: 1, createdAt: -1 });
reportDownloadSchema.index({ createdAt: -1 });
module.exports = mongoose.model("ReportDownload", reportDownloadSchema);
