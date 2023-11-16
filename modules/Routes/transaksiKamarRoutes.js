const express = require("express");
const router = new express.Router();
const transaksiKamarController = require("../Controller/transaksiKamarController");


router.get("/:id", transaksiKamarController.getKamarByReservasiId);

module.exports = router;