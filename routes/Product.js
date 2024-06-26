const express = require("express");
const router = express.Router();

const { create, addImage, deleteImage, deleteProduct, getProducts, changePrice } = require("../controllers/Product");
const { auth } = require("../middlewares/Auth");


router.post("/create" , auth , create);
router.post("/:productId/image/add" , auth , addImage);
router.delete("/image/delete" , auth , deleteImage);
router.delete("/:productId/delete" , auth , deleteProduct);
router.get("/allProducts" , getProducts);
router.put("/:productId/changePrice" , auth , changePrice);

module.exports = router;