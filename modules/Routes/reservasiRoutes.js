const express = require("express");
const router = new express.Router();
const reservasiController = require("../Controller/reservasiController");

router.post("/personal", reservasiController.makeReservasiPersonal);
router.post("/group", reservasiController.makeReservasiGroup);
router.post("/tarifs", reservasiController.getTarifByJenisKamar);
router.post("/besarans", reservasiController.getBesaranTarifByJenisKamar);
router.put("/update/:id", reservasiController.updateReservasi);
router.get("/", reservasiController.getReservasi);
router.get("/:id", reservasiController.getReservasiById);


module.exports = router;