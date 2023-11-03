const express = require("express");
const router = new express.Router();
const customerController = require("../Controller/customerController");

router.post("/", customerController.createCustomer);
router.post("/group", customerController.createCustomerGroup);
router.get("/", customerController.getCustomer);
router.get("/:id", customerController.getCustomerById);
router.put("/:id", customerController.updateCustomer);
router.delete("/:id", customerController.deleteCustomer);
router.get("/akun/:id", customerController.getCustomerByAkunID);

module.exports = router;