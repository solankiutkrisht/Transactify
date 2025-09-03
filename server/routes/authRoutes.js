const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const verifyToken = require("../middleware/verifyToken");

router.post("/register", authController.register);
router.post("/verifyOTP", authController.verifyOTP);
router.post("/regenerateOTP", authController.regenerateOTP);
router.post("/login", authController.login);
router.get("/protectedRoute", verifyToken, authController.protectedRoute);

module.exports = router;
