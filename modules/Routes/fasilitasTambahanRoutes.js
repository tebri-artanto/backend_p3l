const express = require("express");
const router = new express.Router();
const fasilitasTambahanController = require("../Controller/fasilitasTambahanController");

router.post("/", fasilitasTambahanController.createFasilitasTambahan);
router.get("/", fasilitasTambahanController.getFasilitasTambahan);
router.get("/:id", fasilitasTambahanController.getFasilitasTambahanById);
router.put("/:id", fasilitasTambahanController.updateFasilitasTambahan);
router.delete("/:id", fasilitasTambahanController.deleteFasilitasTambahan);

module.exports = router;