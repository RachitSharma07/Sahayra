const ServiceCategory = require("../models/ServiceCategory");

const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({
        message: "Category name is required",
      });
    }

    const category = await ServiceCategory.create({
      name,
      description,
    });

    return res.status(201).json({
      message: "Service category created successfully",
      category,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to create service category",
    });
  }
};

const getCategories = async (req, res) => {
  try {
    const categories = await ServiceCategory.find({
      isActive: true,
    });

    return res.status(200).json({
      categories,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch service categories",
    });
  }
};

module.exports = {
  createCategory,
  getCategories,
};
