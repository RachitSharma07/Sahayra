const express = require("express");
const providerController = require("../controllers/providerController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const upload = require("../middleware/uploadMiddleware");
const router = express.Router();

router.post(
  "/provider/profile",
  authMiddleware,
  roleMiddleware("provider"),
  providerController.createProviderProfile,
);

router.put(
  "/provider/profile",
  authMiddleware,
  roleMiddleware("provider"),
  providerController.updateProviderSkillsExperience,
);

router.put(
  "/provider/profile/location",
  authMiddleware,
  roleMiddleware("provider"),
  providerController.updateProviderLocationAvailability,
);

router.put(
  "/provider/:providerId/verify",
  authMiddleware,
  roleMiddleware("admin"),
  providerController.verifyProvider,
);

router.put(
  "/provider/:providerId/reject",
  authMiddleware,
  roleMiddleware("admin"),
  providerController.rejectProvider,
);

router.get(
  "/provider/dashboard",
  authMiddleware,
  roleMiddleware("provider"),
  providerController.getProviderDashboard,
);

router.patch(
  "/profile-image",
  authMiddleware,
  upload.single("file"),
  providerController.uploadProfileImage,
);

router.delete(
  "/profile-image",
  authMiddleware,
  providerController.deleteProfileImage,
);

module.exports = router;
