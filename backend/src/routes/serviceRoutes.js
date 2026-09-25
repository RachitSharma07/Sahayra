const express = require("express");

const serviceController = require("../controllers/serviceController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const upload = require("../middleware/uploadMiddleware");
const router = express.Router();

router.post(
  "/services",
  authMiddleware,
  roleMiddleware("provider"),
  serviceController.createService,
);

router.put(
  "/services/:serviceId",
  authMiddleware,
  roleMiddleware("provider"),
  serviceController.updateService,
);

router.delete(
  "/services/:serviceId",
  authMiddleware,
  roleMiddleware("provider"),
  serviceController.deleteService,
);

router.get("/services/search", authMiddleware, serviceController.getServices);

router.get(
  "/services/:serviceId",
  authMiddleware,
  serviceController.getServiceById,
);

router.get(
  "/services",
  authMiddleware,
  roleMiddleware("provider"),
  serviceController.getMyServices,
);

router.patch(
  "/:serviceId/images",
  authMiddleware,
  upload.array("images", 5),
  serviceController.uploadServiceImages,
);

router.delete(
  "/:serviceId/images/:imageId",
  authMiddleware,
  serviceController.deleteServiceImage,
);
module.exports = router;
