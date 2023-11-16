const express = require("express");
const router = new express.Router();
const tarifController = require("../Controller/tarifController");

router.post("/", tarifController.createTarif);
router.get("/", tarifController.getTarif);
router.get("/:id", tarifController.getTarifById);
router.put("/:id", tarifController.updateTarif);
router.delete("/:id", tarifController.deleteTarif);
router.get("/search/:id_season", tarifController.getTarifBySeasonId);
router.get("/withKamar/:id_season", tarifController.getTarifAndKamarBySeasonId);
router.get("/kamar/:id_season", tarifController.getKamarBySeasonId);
router.get("/kamarId/:id_kamar", tarifController.getTarifByKamarId);

module.exports = router;