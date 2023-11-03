const express = require("express");
const router = new express.Router();
const authController = require("../Controller/authController");
const authenticateMiddleware = require("../middleware/authenticateMiddleware");

router.get("/", authController.getAkun);
// router.get("/:id", authController.getAkunById);
router.post("/login", authController.logIn);
router.post("/register", authController.signUp);
router.put("/:id", authController.updatePassword);
router.get("/profile", authController.getAkunByToken);
router.post("/logout", authController.logout);

module.exports = router;