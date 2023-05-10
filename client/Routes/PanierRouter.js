const express = require('express');
const router = express.Router();

const {CreatePanier,updatePanier,getProductsPanierByUSer,deleteProduct} = require('../Controllers/PanierController');

router.post("/createPanier",CreatePanier);
router.put("/updateQuantity/:id",updatePanier);
router.get("/getUserProducts/:id",getProductsPanierByUSer);
router.delete("/deleteProductPanier/:id",deleteProduct);

module.exports= router;