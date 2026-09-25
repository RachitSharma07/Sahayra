const express = require ("express");
const authController = require ("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const router = express.Router();


router.post("/auth/register", authController.register);

router.post("/auth/login", authController.login);
router.get("/auth/me", authMiddleware, (req, res) => {
    res.status(200).json({
        message: "Authentication successful",
        user: req.user
    });
});

router.get(
    "/customer-test",
    authMiddleware,
    roleMiddleware("customer"),
    (req, res) => {
        res.status(200).json({
            message: "Customer access granted"
        });
    }
);

router.get(
    "/provider-test",
    authMiddleware,
    roleMiddleware("provider"),
    (req, res) => {
        res.status(200).json({
            message: "Provider access granted"
        });
    }
);

router.get(
    "/admin-test",
    authMiddleware,
    roleMiddleware("admin"),
    (req, res) => {
        res.status(200).json({
            message: "Admin access granted"
        });
    }
);

module.exports=router;