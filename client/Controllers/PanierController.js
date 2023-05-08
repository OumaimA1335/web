const PanierProduits = require("../Modals/Panier");


async function CreatePanier (req,res)
{
    const { userId, produitId, taille, createdAt, updatedAt } = req.body;
    let panier , findProduit
    try{
       findProduit = await PanierProduits.findOne({
        where:{
           userId : userId,
           produitId :produitId 
        }
       })
       if(findProduit)
       {
        console.log("le produit existe déja dans la panier")
       }else
       {
        panier = await PanierProduits.create({
            userId,
            produitId,
            taille,
            createdAt,
            updatedAt
        })
       }
    }catch(err)
    {
        console.log(err);
    }
    if (!panier) {
        return res.status(500).json({ message: "Unable to add this product" });
      }
      return res.status(201).json({ panier});
}
async function updatePanier (req,res)
{   const id = req.params.id;
    const {quantite ,updatedAt} = req.body
    let product
    try{
     product = await PanierProduits.findByPk(id);
     product.set({
       quantite,
       updatedAt
     })
     product.save();
    }catch(err)
    {
        console.log(err)
    }
    return res.status(201).json({product});
}
async function getProductsPanierByUSer(req,res)
{   const id = req.params.id;
    let products;
    try{
      products = await PanierProduits.findAll({
        where:{
            userId : id
        }
      })
    }catch(err)
    {
        console.log(err)
    }
    if (!products) {
        return res.status(500).json({ message: "Unable to get products of this user" });
      }
      return res.status(201).json({products});
}
async function deleteProduct (req,res)
{   const id = req.params.id;
    let product;
    try{
    product = await PanierProduits.findByPk(id);
    product.destroy();
    }catch(err)
    {
        console.log(err);
    }
    return res.status(200).json({ message: "product deleted successfully" });
}
module.exports={
    CreatePanier,
    updatePanier,
    getProductsPanierByUSer,
    deleteProduct
}