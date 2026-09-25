const mongoose = require("mongoose");

const serviceCategorySchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

const ServiceCategory = mongoose.model(
  "ServiceCategory",
  serviceCategorySchema,
);

module.exports = ServiceCategory;
