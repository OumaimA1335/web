const Couleur = require("../modals/Couleur");
const CouleursProduit = require("../modals/CouleurProduit");
const  Produit  = require("../modals/Produit");
const { SousCategorie } = require("../modals/SousCategorie");
const { Op } = require('sequelize');
const TailleProduit = require("../modals/TailleProduit");
const Taille = require("../modals/Taille");
//Get All Products
async function GetAllProducts(req, res) {
  let products;
  try {
    products = await Produit.findAll();
  } catch (err) {
    console.log(err);
  }
  if (products) {
    res.json({ products });
  } else {
    res.status(404).send("Products not found");
  }
}
// Get Product Id
async function GetProductId(req, res) {
  const id = req.params.id;
  let product;
  try {
    product = await Produit.findByPk(id);
  } catch (err) {
    console.log(err);
  }

  if (product) {
    res.json({ product });
  } else {
    res.status(404).send("Product not found");
  }
}
// Insert product
async function createProduct(req, res) {
  const {
    nom,
    marque_id,
    description,
    prix,
    createdAt,
    updatedAt,
    codeBar,
    imageList,
    Tailles,
    sexe,
    souscategorie_id,
    model,
    quantite,
    PartenaireId
  } = req.body;
  console.log(req.body);
  let product,couleurProduit,tailleProduit, categorie,nomcategorie;
  try {
    categorie = await SousCategorie.findByPk(souscategorie_id);
    nomcategorie = categorie.get("nomcategorie");
    console.log(nomcategorie);
    if(souscategorie_id==19)
    {
    console.log("1");
    product = await Produit.create({
      nom,
      marque_id,
      description,
      prix,
      createdAt,
      updatedAt,
      codeBar,
      imageList,
      sexe,
      souscategorie_id,
      model,
      PartenaireId
    });
    let id = product.get("id");
    await Promise.all(Tailles.map(async (item) => {
       await TailleProduit.create({
        tailleId: item.id,
        produitId: id,
        quantite: item.quantity,
        createdAt,
        updatedAt,
      });
    }));
  }
    else{
      console.log("22");
      product = await Produit.create({
        nom,
        marque_id,
        description,
        prix,
        createdAt,
        updatedAt,
        codeBar,
        imageList,
        sexe,
        souscategorie_id,
        model,
        quantite,
        PartenaireId
      });
    }
   
    /*for (let i = 0; i < couleurs.length; i++) {
      const couleurId = couleurs[i];
      couleurProduit = await CouleursProduit.create({
        couleurId,
        produitId: id,
        quantite : quantiteCouleurs,
        createdAt,
        updatedAt,
      });
    }*/
   
  } catch (err) {
    console.log(err);
  }
  if (!product) {
    return res.status(500).json({ message: "Unable to add the product" });
  }
  return res.status(201).json({ product });
}

// update product
async function UpdateProduct(req, res) {
  const id = req.params.id;
  const {
    nom,
    description,
    prix,
    createdAt,
    updatedAt,
    codeBar,
    imageList,
    Tailles,
    sexe,
    souscategorie_id,
    model,
    quantite,
    PartenaireId
  } = req.body;
  let product,couleursProduit,tailleProduit,tailleQuantity,couleurQuantity;
  try {
    product = await Produit.findByPk(id);
    categorie = await SousCategorie.findByPk(souscategorie_id);
    if(souscategorie_id==19){
    product.set({
      nom,
      description,
      prix,
      createdAt,
      updatedAt,
      codeBar,
      imageList,
      Tailles,
      sexe,
      souscategorie_id,
      model,
      PartenaireId
    });
    await product.save();
     // récupérer tous les couleures d'un produit
     tailleProduit = await TailleProduit.findAll({
      where:
      {
        produitId :id
      }
    });
    // supprimer tous les couleurs d'un produit
    tailleProduit.map(async(item)=>{
       await item.destroy();
    });
    // ajouter les nouveaux couleurs d'un produit
    await Promise.all(Tailles.map(async (item) => {
      await TailleProduit.create({
       tailleId: item.id,
       produitId: id,
       quantite: item.quantity,
       createdAt,
       updatedAt,
     });
   }));
  }
  else{
    product.set({
      nom,
      description,
      prix,
      createdAt,
      updatedAt,
      codeBar,
      imageList,
      sexe,
      souscategorie_id,
      model,
      quantite,
      PartenaireId
    });
    await product.save();
  }
  } catch (err) {
    console.log(err);
  }
  return res.status(200).json({ product });
}

async function getColorsProduct(req,res)
{  const id = req.params.id;
  let  colorsProduct,couleur,obj, couleurs=[];
  try{
   colorsProduct = await CouleursProduit.findAll({
    where:{
      produitId :id
    }
   });
  await Promise.all( colorsProduct.map(async(item)=>
   { 
      
      couleurs.push(item.couleurId);

   }));
  }catch(err)
  {
    console.log(err)
  }
  return res.status(200).json({ couleurs });
}
async function getTailleProduct(req,res)
{  const id = req.params.id;
  let  taillesProduct,couleur,obj, tailles=[],taille,nomTaille;
  try{
   taillesProduct = await TailleProduit.findAll({
    where:{
      produitId :id
    }
   });
  await Promise.all(taillesProduct.map(async(item)=>
   { 
      taille = await Taille.findByPk(item.tailleId); 
      nomTaille = taille.get("taille")
      tailles.push({
        id : item.tailleId,
        taille: nomTaille,
        quantity : item.quantite
      });

   }));
  }catch(err)
  {
    console.log(err)
  }
  return res.status(200).json({ tailles });
}
async function getQuantityCouleur (req,res)
{
  const id = req.params.id;
  let  colorsProduct,couleur,obj, couleurs="";
  try{
   colorsProduct = await CouleursProduit.findAll({
    where:{
      produitId :id
    }
   });
  await Promise.all( colorsProduct.map(async(item)=>
   { 
      
    couleurs = couleurs.concat(item.quantite)+ " ";

   }));
  }catch(err)
  {
    console.log(err)
  }
  return res.status(200).json({ couleurs });
}
async function getQuantityTaille(req,res)
{  const id = req.params.id;
  let  taillesProduct,couleur,obj, tailles="",taille,nomTaille;
  try{
   taillesProduct = await TailleProduit.findAll({
    where:{
      produitId :id
    }
   });
  await Promise.all(taillesProduct.map(async(item)=>
   { 
     
     tailles = tailles.concat(item.quantite) + " ";

   }));
  }catch(err)
  {
    console.log(err)
  }
  return res.status(200).json({ tailles });
}
// supprimer un produit
async function deleteProduct(req, res) {
  const id = req.params.id;
  try {
    const product = await Produit.findByPk(id);
    await product.destroy();
  } catch (err) {
    console.log(err);
  }
  return res.status(200).json({ message: "Product deleted successfully" });
}
// recherche par nom
async function searchNameProduct(req, res) {
  const nom1 = req.params.nom;
  let product;
  try {
    product = await Produit.findAll({
      where:{
        nom: {
          [Op.like]: `${nom1}%`,// Search for products that contain the first word in their name
        },
      }
    });
  } catch (err) {
    console.log(err);
  }
  if (product) return res.status(200).json({ product });
}
//rechereche par marque
async function searchBrandProduct(req, res) {
  const marque1 = req.params.brand;
  let product;
  try {
    product = await Produit.findAll({
      where: {
        marque_id: marque1,
      },
    });
  } catch (err) {
    console.log(err);
  }
  if (product) return res.status(200).json({ product });
}
//recherche par catégorie
async function searchCategoryProduct(req, res) {
  const id = req.params.category;
  let product, souscategorieNum,sousCategorie;
  try {
    product = await Produit.findByPk(id);
    souscategorieNum = product.get("souscategorie_id");
    sousCategorie= await SousCategorie.findByPk(souscategorieNum);
  } catch (err) {
    console.log(err);
  }
  if (sousCategorie) return res.status(200).json([sousCategorie]);
}
// recherche par type 
async function searchTypeProduct(req, res) {
  const type = req.params.type;
  let product;
  try {
    product = await Produit.findAll({
      where: {
        type_id: type,
      },
    });
  } catch (err) {
    console.log(err);
  }
  if (product) return res.status(200).json({ product });
}

async function addProductToOffer(req, res) {
  const idProduct = req.params.idP;
  const idOffer = req.params.idO;
  let product;
  try {
    product = await Produit.findByPk(idProduct);
    product.set({
      offreId: idOffer,
    });
    await product.save();
  } catch (err) {
    console.log(err);
  }
  if (product) return res.status(200).json({ product });
}
async function getImagesProducts(req,res)
{
  const id = req.params.id;
  let product , imagelist
  try{
   product = await Produit.findByPk(id);
   imagelist = product.get("imageList");
  }catch(err)
  {
    console.log(err)
  }
  if (imagelist) return res.status(200).json({ imagelist });
}
async function getProductByCategory (req,res)
{ let products, category , idCategory ,TabIdCategory=[];
  const categorie = req.params.id;
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);

  console.log(categorie);
  try{
  if(categorie === "Vêtements")
  {
    category = await SousCategorie.findOne({
      where:
      {
        nomcategorie:categorie
      }
     });
     idCategory = category.get("idSousCategorie");
     products = await Produit.findAll({
      where :
      {
        souscategorie_id :idCategory
      }
     })
  }else if(categorie === "Accessoires")
  {
    category = await SousCategorie.findAll({
      where:
      {
        nomcategorie:categorie
      }
     });
     await Promise.all( category.map(async(item,index)=>
    {
      TabIdCategory.push(item.get("idSousCategorie"))
    }))
    products = await Produit.findAll({
      where :
      {
        [Op.or]: [
          { souscategorie_id: TabIdCategory[0] }
        ]
      }
     })
  }else if(categorie === "Nouveauté")
  {
    products = await Produit.findAll({
      where :
      {
        createdAt: {
          [Op.gt]: weekAgo
        }
      }
     })
  }else if(categorie === "Promotion")
  {
    products = await Produit.findAll({
      where :
      {
        offreId: {
          [Op.not]: null
        }
      }
     })
  }else if(categorie === "Essayer")
  {
    products = await Produit.findAll({
      where :
      {
        model: {
          [Op.not]: null
        }
      }
     })
  }
  else if(categorie ==="Commandée")
  { 
    const sequelize = require("../../database");
    const result = await sequelize.query(`
    SELECT cp."produitId", SUM(cp.quantite) as total_quantity
    FROM "commandeProduits" cp
    JOIN "produits" p ON cp."produitId" = p.id
    GROUP BY cp."produitId"
    ORDER BY total_quantity DESC
    LIMIT 10;  
  `, { type: sequelize.QueryTypes.SELECT });

  const produitIds =await Promise.all(result.map(item => item.produitId));
   products = await Produit.findAll({
    where: {
      id: produitIds
    }
  });
 
  }
  }catch(err)
  {
    console.log(err)
  }
  if (products) return res.status(200).json({ products });
}
async function getColorsProductMobile(req,res)
{  const id = req.params.id;
  let  colorsProduct,couleur,obj, couleurs=[];
  try{
   colorsProduct = await CouleursProduit.findAll({
    where:{
      produitId :id
    }
   });
  await Promise.all(colorsProduct.map(async(item)=>
   {  
      obj = await Couleur.findByPk(item.couleurId);
      couleur = obj.get("couleur")
      couleurs.push(couleur);
   }));
  }catch(err)
  {
    console.log(err)
  }
  return res.status(200).json({ couleurs });
}
async function getProductsBySouSCategory (req,res)
{ 
  const idCategory = req.params.id;
  let products;
  try{
    products = await Produit.findAll({
      where:{
        souscategorie_id : idCategory
      }
    })
  }catch(err)
  {
    console.log(err);
  }
  return res.status(200).json({ products });
}

module.exports = {
  GetProductId,
  createProduct,
  GetAllProducts,
  UpdateProduct,
  deleteProduct,
  searchNameProduct,
  searchBrandProduct,
  searchCategoryProduct,
  searchTypeProduct,
  addProductToOffer,
  getImagesProducts,
  getColorsProduct,
  getProductByCategory,
  getColorsProductMobile,
  getProductsBySouSCategory,
  getTailleProduct,
  getQuantityCouleur,
  getQuantityTaille
};
