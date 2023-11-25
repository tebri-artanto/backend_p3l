const express = require("express");
const router = new express.Router();
const laporanController = require("../Controller/laporanController");

router.get("/laporan1", laporanController.getLaporan1);
router.get("/laporan2", laporanController.getLaporan2);
router.get("/laporan3", laporanController.getLaporan3);
router.get("/laporan4", laporanController.getLaporan4);

module.exports = router;