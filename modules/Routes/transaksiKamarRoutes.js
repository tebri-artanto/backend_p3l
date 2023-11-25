const express = require("express");
const router = new express.Router();
const transaksiKamarController = require("../Controller/transaksiKamarController");


router.get("/:id", transaksiKamarController.getKamarByReservasiId);
router.get("/all/:id", transaksiKamarController.getKamarsByReservasiId);
router.get("/", transaksiKamarController.getTransaksiKamar);

module.exports = router;