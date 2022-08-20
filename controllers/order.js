import {Order}  from "../model/order.js";

const getOrders = (req, res, next) => {
  Order.find({creator:req.userData.userId}).populate('orderedItems.item').then(fetchedOrders=>{      
    res.status(200).json({
      message: "success",
      orders: fetchedOrders
    });
  }).catch(err=>{
    res.status(500).json({message:'Fetching orders failed!',error:err});
  });
}

export const orderController = {getOrders};