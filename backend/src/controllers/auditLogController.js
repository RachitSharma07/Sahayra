const AuditLog = require("../models/AuditLog");
const createAuditLog = async ({
  user,
  action,
  entity,
  entityId = null,
  description,
  req,
  metadata = {},
}) => {
  try {
    await AuditLog.create({
      user,
      action,
      entity,
      entityId,
      description,
      ipAddress:
        req?.headers["x-forwarded-for"] || req?.socket?.remoteAddress || null,
      userAgent: req?.headers["user-agent"] || null,
      metadata,
    });
  } catch (error) {
    console.error("Audit log creation failed:", error.message);
  }
};
module.exports = { createAuditLog };
