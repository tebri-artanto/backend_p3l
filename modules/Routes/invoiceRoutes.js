const express = require("express");
const router = new express.Router();
const invoicePelunasanController = require("../Controller/invoicePelunasanController");


router.get("/:id", invoicePelunasanController.getInvoicePelunasan);
router.get("/reservasi/:id", invoicePelunasanController.getInvoiceByReservasiId);
router.post("/personal", invoicePelunasanController.createInvoicePelunasanPesonal);
router.post("/group", invoicePelunasanController.createInvoicePelunasanGroup);
module.exports = router;