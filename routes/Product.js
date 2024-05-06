const express = require("express");
const router = express.Router();

const { create, createone } = require("../controllers/Product");
const { auth } = require("../middlewares/Auth");


router.post("/create" , auth , create);
router.post("/createone" , auth , createone);

module.exports = router;