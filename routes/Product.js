const express = require("express");
const router = express.Router();

const { create, addImage } = require("../controllers/Product");
const { auth } = require("../middlewares/Auth");


router.post("/create" , auth , create);
router.post("/:productId/image/add" , auth , addImage);

module.exports = router;