
const express = require("express");
const router = new express.Router();
const perhitunganController = require("../Controller/perhitunganController");
// Use the function in your Express route
router.post('/calculateDays', perhitunganController.calculateDays);
router.get('/multiply', perhitunganController.multiply);

module.exports = router;