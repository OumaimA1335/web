const express = require('express');
const router = express.Router();

const {createFavoris,getProducts,getFavoriteProductById,deletefavoriteProduct,getProductsFavByUSer,NumbrerLikes
}=require("../Controllers/FavorisController");

router.post("/createFavoris",createFavoris);
router.get("/getFavoriteProducts",getProducts);
router.get("/getFavoriteProductById/:id",getFavoriteProductById);
router.delete("/deletefavoriteProduct/:id",deletefavoriteProduct);
router.get("/getProductsFavByUSer/:id",getProductsFavByUSer);
router.get("/NumberLikes/:id",NumbrerLikes);
module.exports=router;