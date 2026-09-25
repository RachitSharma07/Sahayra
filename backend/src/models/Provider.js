const mongoose = require("mongoose");

const providerSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    skills: {
      type: [String],
      required: true,
    },

    experience: {
      type: Number,
      min: 0,
    },

    location: {
      type: String,
      required: true,
    },

    availability: {
      type: Boolean,
      default: true,
    },

    verificationStatus: {
      type: String,
      enum: ["pending", "verified", "rejected"],
      default: "pending",
    },

    profileImage: {
      url: {
        type: String,
        default: null,
      },

      publicId: {
        type: String,
        default: null,
      },
    },
  },
  {
    timestamps: true,
  },
);

const Provider = mongoose.model("Provider", providerSchema);

module.exports = Provider;