const fs = require("fs");
const Provider = require("../models/Provider");
const uploadToCloudinary = require("../utils/cloudinaryUpload");
const cloudinary = require("../config/cloudinary");
const { createAuditLog } = require("./auditLogController");

const createProviderProfile = async (req, res) => {
  try {
    const { skills, experience, location } = req.body;

    if (!skills || !location) {
      return res.status(400).json({
        message: "Skills and location are required",
      });
    }

    const provider = await Provider.create({
      user: req.user.userId,
      skills,
      experience,
      location,
    });

    await createAuditLog({
      user: req.user.userId,
      action: "CREATE_PROVIDER_PROFILE",
      entity: "Provider",
      entityId: provider._id,
      description: "Provider profile created",
      req,
      metadata: {
        skills,
        experience,
        location,
      },
    });

    return res.status(201).json({
      message: "Provider profile created successfully",
      provider,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create provider profile",
    });
  }
};

const updateProviderSkillsExperience = async (req, res) => {
  try {
    const { skills, experience } = req.body;

    if (!skills || experience === undefined) {
      return res.status(400).json({
        message: "Skills and experience are required",
      });
    }

    const provider = await Provider.findOne({
      user: req.user.userId,
    });

    if (!provider) {
      return res.status(404).json({
        message: "Provider profile not found",
      });
    }

    provider.skills = skills;
    provider.experience = experience;

    await provider.save();

    await createAuditLog({
      user: req.user.userId,
      action: "UPDATE_PROVIDER_PROFILE",
      entity: "Provider",
      entityId: provider._id,
      description: "Provider skills and experience updated",
      req,
      metadata: {
        skills,
        experience,
      },
    });

    return res.status(200).json({
      message: "Provider skills and experience updated successfully",
      provider,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update provider skills and experience",
    });
  }
};

const updateProviderLocationAvailability = async (req, res) => {
  try {
    const { location, availability } = req.body;

    const provider = await Provider.findOne({
      user: req.user.userId,
    });

    if (!provider) {
      return res.status(404).json({
        message: "Provider does not exist",
      });
    }

    provider.location = location;
    provider.availability = availability;

    await provider.save();

    await createAuditLog({
      user: req.user.userId,
      action: "UPDATE_PROVIDER_AVAILABILITY",
      entity: "Provider",
      entityId: provider._id,
      description: "Provider location and availability updated",
      req,
      metadata: {
        location,
        availability,
      },
    });

    return res.status(200).json({
      message: "Location and Availibilty Successfully updated",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to update location and availability",
    });
  }
};

const verifyProvider = async (req, res) => {
  try {
    const { providerId } = req.params;

    const provider = await Provider.findById(providerId);

    if (!provider) {
      return res.status(404).json({
        message: "Provider does not exist",
      });
    }

    const previousStatus = provider.verificationStatus;

    provider.verificationStatus = "verified";

    await provider.save();

    await createAuditLog({
      user: req.user.userId,
      action: "VERIFY_PROVIDER",
      entity: "Provider",
      entityId: provider._id,
      description: "Provider verified",
      req,
      metadata: {
        previousStatus,
        newStatus: "verified",
      },
    });

    return res.status(200).json({
      message: "Provider verified successfully",
      provider,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to verify provider",
    });
  }
};

const rejectProvider = async (req, res) => {
  try {
    const { providerId } = req.params;

    const provider = await Provider.findById(providerId);

    if (!provider) {
      return res.status(404).json({
        message: "Provider does not exist",
      });
    }

    const previousStatus = provider.verificationStatus;

    provider.verificationStatus = "rejected";

    await provider.save();

    await createAuditLog({
      user: req.user.userId,
      action: "REJECT_PROVIDER",
      entity: "Provider",
      entityId: provider._id,
      description: "Provider rejected",
      req,
      metadata: {
        previousStatus,
        newStatus: "rejected",
      },
    });

    return res.status(200).json({
      message: "Provider rejected successfully",
      provider,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to reject provider",
    });
  }
};

const getProviderDashboard = async (req, res) => {
  try {
    const provider = await Provider.findOne({
      user: req.user.userId,
    });

    if (!provider) {
      return res.status(404).json({
        message: "Provider profile not found",
      });
    }

    return res.status(200).json({
      message: "Provider dashboard fetched successfully",
      provider,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch provider dashboard",
    });
  }
};

const uploadProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "No image uploaded",
      });
    }

    const provider = await Provider.findOne({
      user: req.user.userId,
    });

    if (!provider) {
      return res.status(404).json({
        message: "Provider profile not found",
      });
    }

    const uploadResult = await uploadToCloudinary(req.file.path);

    if (provider.profileImage?.publicId) {
      await cloudinary.uploader.destroy(provider.profileImage.publicId);
    }

    provider.profileImage = {
      url: uploadResult.url,
      publicId: uploadResult.publicId,
    };

    await provider.save();

    fs.unlinkSync(req.file.path);

    await createAuditLog({
      user: req.user.userId,
      action: "UPLOAD_PROVIDER_PROFILE_IMAGE",
      entity: "Provider",
      entityId: provider._id,
      description: "Provider profile image uploaded",
      req,
      metadata: {
        imageUrl: uploadResult.url,
      },
    });

    return res.status(200).json({
      message: "Profile image uploaded successfully",
      profileImage: provider.profileImage,
    });
  } catch (error) {
    console.error("Profile image upload error:", error);

    return res.status(500).json({
      message: "Failed to upload profile image",
    });
  }
};

const deleteProfileImage = async (req, res) => {
  try {
    const provider = await Provider.findOne({
      user: req.user.userId,
    });

    if (!provider) {
      return res.status(404).json({
        message: "Provider profile not found",
      });
    }

    if (!provider.profileImage?.publicId) {
      return res.status(404).json({
        message: "Profile image not found",
      });
    }

    await cloudinary.uploader.destroy(provider.profileImage.publicId);

    provider.profileImage = {
      url: null,
      publicId: null,
    };

    await provider.save();

    await createAuditLog({
      user: req.user.userId,
      action: "DELETE_PROVIDER_PROFILE_IMAGE",
      entity: "Provider",
      entityId: provider._id,
      description: "Provider profile image deleted",
      req,
    });

    return res.status(200).json({
      message: "Profile image deleted successfully",
    });
  } catch (error) {
    console.error("Profile image delete error:", error);

    return res.status(500).json({
      message: "Failed to delete profile image",
    });
  }
};

module.exports = {
  createProviderProfile,
  updateProviderSkillsExperience,
  updateProviderLocationAvailability,
  verifyProvider,
  rejectProvider,
  getProviderDashboard,
  uploadProfileImage,
  deleteProfileImage,
};
