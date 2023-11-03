const express = require("express");
const router = new express.Router();
const tarifController = require("../Controller/tarifController");

router.post("/", tarifController.createTarif);
router.get("/", tarifController.getTarif);
router.get("/:id", tarifController.getTarifById);
router.put("/:id", tarifController.updateTarif);
router.delete("/:id", tarifController.deleteTarif);

module.exports = router;