import { Product } from "../model/product.js";

const getProducts = (req, res, next) => {  
    Product.find().then(fetchedProducts=>{      
      res.status(200).json({
        message: "success",
        products: fetchedProducts
      });
    }).catch(err=>{
      res.status(500).json({message:'Fetching Products failed!',error:err});
    });
}

const addProduct = (req, res, next) => {   
  console.log(req.body);
  const product=new Product({
    name: req.body.name,
    displayQuantity: req.body.displayQuantity,
    price:req.body.price
  });
  product.save().then(result=>{
    console.log(result,"result");
    res.status(201).json({
      message: "success",
      product:{
        id:result._id,          
        ...result
      }
    });
  }).catch(err=>{
    res.status(500).json({message:'Creating product Failed!',error:err});
  }) 
}

export const productController = {getProducts,addProduct};