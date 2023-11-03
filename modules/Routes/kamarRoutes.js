const express = require("express");
const router = new express.Router();
const kamarController = require("../Controller/kamarController");

router.post("/", kamarController.createKamar);
router.get("/", kamarController.getKamar);
router.get("/:id", kamarController.getKamarById);
router.put("/:id", kamarController.updateKamar);
router.delete("/:id", kamarController.deleteKamar);

module.exports = router;