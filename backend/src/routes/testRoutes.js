const testController=require("../controllers/testController")
const express = require("express");
const router = express.Router();


router.get("/test",testController);
router.post("/test",testController)

module.exports = router;