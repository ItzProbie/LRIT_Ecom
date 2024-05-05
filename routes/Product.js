const express = require("express");
const router = express.Router();

const { create } = require("../controllers/Product");
const { auth } = require("../middlewares/Auth");

router.post("/create" , auth , create);
router.post("/createone" , auth , create);

module.exports = router;