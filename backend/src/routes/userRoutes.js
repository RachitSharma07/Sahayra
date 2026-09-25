const userController = require('../controllers/userController');
const express = require('express');
const router = express.Router();

router.post("/users" , userController);

module.exports=router;