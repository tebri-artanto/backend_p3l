const express = require("express");
const router = new express.Router();
const pegawaiController = require("../Controller/pegawaiController");

router.post("/", pegawaiController.createPegawai);
router.get("/", pegawaiController.getPegawai);
router.get("/:id", pegawaiController.getPegawaiById);
router.put("/:id", pegawaiController.updatePegawai);
router.delete("/:id", pegawaiController.deletePegawai);
router.get("/akun/:id", pegawaiController.getPegawaiByAkunID);

module.exports = router;