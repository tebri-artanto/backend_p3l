const express = require("express");
const router = new express.Router();
const transaksiFasilitasController = require("../Controller/transaksiFasilitasController");


router.get("/:id_reservasi", transaksiFasilitasController.getTransaksiFasilitasByReservasiId);

module.exports = router;