const express = require("express");
const router = express.Router();

const { auth } = require("../middlewares/Auth");
const { addToCart, removeFromCart } = require("../controllers/Cart");

router.post("/add/:productId" ,auth , addToCart);
router.post("/remove/:productId" ,auth , removeFromCart);

module.exports = router;