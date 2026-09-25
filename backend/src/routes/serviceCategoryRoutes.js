const express = require("express");

const serviceCategoryController = require("../controllers/serviceCategoryController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

router.post(
  "/categories",
  authMiddleware,
  roleMiddleware("admin"),
  serviceCategoryController.createCategory,
);

router.get(
  "/categories",
  authMiddleware,
  serviceCategoryController.getCategories,
);

module.exports = router;
