const express = require("express");
const router = new express.Router();
const seasonController = require("../Controller/seasonController");

router.post("/", seasonController.createSeason);
router.get("/", seasonController.getSeason);
router.get("/search", seasonController.getSeasonByDate);
router.get("/:id", seasonController.getSeasonById);
router.put("/:id", seasonController.updateSeason);
router.delete("/:id", seasonController.deleteSeason);


module.exports = router;