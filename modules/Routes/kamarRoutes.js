const express = require("express");
const router = new express.Router();
const kamarController = require("../Controller/kamarController");

router.post("/", kamarController.createKamar);
router.get("/", kamarController.getKamar);
router.get("/:id", kamarController.getKamarById);
router.put("/:id", kamarController.updateKamar);
router.delete("/:id", kamarController.deleteKamar);
router.get("/search", kamarController.searchKamarByDate);
router.get("/search/:id_tarif", kamarController.getKamarByIdTarif);
router.post("/mutipleKamar", kamarController.getMutipleKamarById);
router.get("/season/:id_season", kamarController.getKamarByIdSeason);
module.exports = router;