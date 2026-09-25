const Service = require("../models/Service");
const Provider = require("../models/Provider");
const ServiceCategory = require("../models/ServiceCategory");
const { createAuditLog } = require("./auditLogController");
const fs = require("fs");
const uploadToCloudinary = require("../utils/cloudinaryUpload");
const createService = async (req, res) => {
  try {
    const { name, description, price, duration, category } = req.body;
    if (!name || price === undefined || !duration || !category) {
      return res
        .status(400)
        .json({ message: "Name, price, duration and category are required" });
    }
    const provider = await Provider.findOne({ user: req.user.userId });
    if (!provider) {
      return res.status(404).json({ message: "Provider profile not found" });
    }
    const serviceCategory = await ServiceCategory.findOne({
      _id: category,
      isActive: true,
    });
    if (!serviceCategory) {
      return res
        .status(404)
        .json({ message: "Service category not found or inactive" });
    }
    const service = await Service.create({
      provider: provider._id,
      name,
      description,
      price,
      duration,
      category,
    });
    await createAuditLog({
      user: req.user.userId,
      action: "CREATE_SERVICE",
      entity: "Service",
      entityId: service._id,
      description: "Provider created a new service",
      req,
      metadata: {
        serviceName: service.name,
        price: service.price,
        duration: service.duration,
        category: service.category,
      },
    });
    return res
      .status(201)
      .json({ message: "Service created successfully", service });
  } catch (error) {
    return res.status(500).json({ message: "Failed to create service" });
  }
};
const updateService = async (req, res) => {
  try {
    const { serviceId } = req.params;
    const { name, description, price, duration, category } = req.body;
    const provider = await Provider.findOne({ user: req.user.userId });
    if (!provider) {
      return res.status(404).json({ message: "Provider profile not found" });
    }
    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }
    if (service.provider.toString() !== provider._id.toString()) {
      return res
        .status(403)
        .json({ message: "You are not authorized to update this service" });
    }
    if (category) {
      const serviceCategory = await ServiceCategory.findOne({
        _id: category,
        isActive: true,
      });
      if (!serviceCategory) {
        return res
          .status(404)
          .json({ message: "Service category not found or inactive" });
      }
    }
    const previousData = {
      name: service.name,
      description: service.description,
      price: service.price,
      duration: service.duration,
      category: service.category,
    };
    service.name = name ?? service.name;
    service.description = description ?? service.description;
    service.price = price ?? service.price;
    service.duration = duration ?? service.duration;
    service.category = category ?? service.category;
    await service.save();
    await createAuditLog({
      user: req.user.userId,
      action: "UPDATE_SERVICE",
      entity: "Service",
      entityId: service._id,
      description: `Provider updated service "${previousData.name}"`,
      req,
      metadata: {
        oldServiceName: previousData.name,
        newServiceName: service.name,
        oldDescription: previousData.description,
        newDescription: service.description,
        oldPrice: previousData.price,
        newPrice: service.price,
        oldDuration: previousData.duration,
        newDuration: service.duration,
        oldCategory: previousData.category,
        newCategory: service.category,
      },
    });
    return res
      .status(200)
      .json({ message: "Service updated successfully", service });
  } catch (error) {
    return res.status(500).json({ message: "Failed to update service" });
  }
};
const deleteService = async (req, res) => {
  try {
    const { serviceId } = req.params;
    const provider = await Provider.findOne({ user: req.user.userId });
    if (!provider) {
      return res.status(404).json({ message: "Provider profile not found" });
    }
    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }
    if (service.provider.toString() !== provider._id.toString()) {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this service" });
    }
    const previousData = {
      name: service.name,
      description: service.description,
      price: service.price,
      duration: service.duration,
      category: service.category,
      isActive: service.isActive,
    };
    service.isActive = false;
    await service.save();
    await createAuditLog({
      user: req.user.userId,
      action: "DELETE_SERVICE",
      entity: "Service",
      entityId: service._id,
      description: `Provider deleted service "${previousData.name}"`,
      req,
      metadata: {
        serviceName: previousData.name,
        description: previousData.description,
        price: previousData.price,
        duration: previousData.duration,
        category: previousData.category,
        previousStatus: previousData.isActive,
        newStatus: service.isActive,
      },
    });
    return res.status(200).json({ message: "Service deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to delete service" });
  }
};
const getServiceById = async (req, res) => {
  try {
    const { serviceId } = req.params;
    const service = await Service.findOne({ _id: serviceId, isActive: true })
      .populate("category", "name description")
      .populate(
        "provider",
        "skills experience location availability verificationStatus",
      );
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }
    return res
      .status(200)
      .json({ message: "Service fetched successfully", service });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch service" });
  }
};
const getMyServices = async (req, res) => {
  try {
    const provider = await Provider.findOne({ user: req.user.userId });
    if (!provider) {
      return res.status(404).json({ message: "Provider profile not found" });
    }
    const services = await Service.find({
      provider: provider._id,
      isActive: true,
    }).populate("category", "name description");
    return res
      .status(200)
      .json({ message: "Services fetched successfully", services });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch services" });
  }
};
const getServices = async (req, res) => {
  try {
    const {
      search,
      category,
      maxPrice,
      sort,
      page = 1,
      limit = 10,
    } = req.query;
    const filter = { isActive: true };
    if (search) {
      filter.name = { $regex: search, $options: "i" };
    }
    if (category) {
      filter.category = category;
    }
    if (maxPrice) {
      filter.price = { $lte: Number(maxPrice) };
    }
    let sortOption = {};
    if (sort === "price_asc") {
      sortOption.price = 1;
    }
    if (sort === "price_desc") {
      sortOption.price = -1;
    }
    const currentPage = Math.max(Number(page), 1);
    const pageLimit = Math.min(Math.max(Number(limit), 1), 100);
    const skip = (currentPage - 1) * pageLimit;
    const totalServices = await Service.countDocuments(filter);
    const services = await Service.find(filter)
      .sort(sortOption)
      .skip(skip)
      .limit(pageLimit)
      .populate("category", "name description")
      .populate(
        "provider",
        "skills experience location availability verificationStatus",
      );
    const totalPages = Math.ceil(totalServices / pageLimit);
    return res
      .status(200)
      .json({
        message: "Services fetched successfully",
        services,
        pagination: {
          currentPage,
          limit: pageLimit,
          totalServices,
          totalPages,
        },
      });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch services" });
  }
};
const uploadServiceImages = async (req, res) => {
  try {
    const { serviceId } = req.params;
    const provider = await Provider.findOne({ user: req.user.userId });
    if (!provider) {
      return res.status(404).json({ message: "Provider profile not found" });
    }
    const service = await Service.findOne({
      _id: serviceId,
      provider: provider._id,
    });
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No images uploaded" });
    }
    const uploadedImages = [];
    for (const file of req.files) {
      const uploadResult = await uploadToCloudinary(file.path);
      uploadedImages.push({
        url: uploadResult.url,
        publicId: uploadResult.publicId,
      });
      fs.unlinkSync(file.path);
    }
    service.images.push(...uploadedImages);
    await service.save();
    return res
      .status(200)
      .json({
        message: "Service images uploaded successfully",
        images: service.images,
      });
  } catch (error) {
    console.error("Service image upload error:", error);
    return res.status(500).json({ message: "Failed to upload service images" });
  }
};
const cloudinary = require("../config/cloudinary");
const deleteServiceImage = async (req, res) => {
  try {
    const { serviceId, imageId } = req.params;
    const provider = await Provider.findOne({ user: req.user.userId });
    if (!provider) {
      return res.status(404).json({ message: "Provider profile not found" });
    }
    const service = await Service.findOne({
      _id: serviceId,
      provider: provider._id,
    });
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }
    const image = service.images.id(imageId);
    if (!image) {
      return res.status(404).json({ message: "Service image not found" });
    }
    await cloudinary.uploader.destroy(image.publicId);
    service.images.pull(imageId);
    await service.save();
    return res
      .status(200)
      .json({
        message: "Service image deleted successfully",
        images: service.images,
      });
  } catch (error) {
    console.error("Service image delete error:", error);
    return res.status(500).json({ message: "Failed to delete service image" });
  }
};
module.exports = {
  createService,
  updateService,
  deleteService,
  getServiceById,
  getMyServices,
  getServices,
  uploadServiceImages,
  deleteServiceImage,
};
