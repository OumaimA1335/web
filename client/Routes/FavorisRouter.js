const express = require('express');
const router = express.Router();

const {createFavoris,getProducts,getFavoriteProductById,deletefavoriteProduct,getProductsFavByUSer}=require("../Controllers/FavorisController");

router.post("/createFavoris",createFavoris);
router.get("/getFavoriteProducts",getProducts);
router.get("/getFavoriteProductById/:id",getFavoriteProductById);
router.delete("/deletefavoriteProduct/:id",deletefavoriteProduct);
router.get("/getProductsFavByUSer/:id",getProductsFavByUSer);
module.exports=router;