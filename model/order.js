import mongoose from "mongoose";

const orderSchema = mongoose.Schema({
    order:[{
        item: {type:mongoose.Schema.Types.ObjectId, ref:"Product",required:true},
        quantity:{type:Number,required:true,default:1 }
    }],
    shipping_details: {
        address: {
          city: {type:String},
          country: {type:String},
          line1: {type:String},
          line2: {type:String},
          postal_code: {type:String},
          state: {type:String}
        },
        name: {type:String}
      },
    shipping_amount:{type:Number,required:true,default:0},
    payment_status:{type:Number,required:true},
    created_at: {type: Date, default: Date.now},
    creator: {type:mongoose.Schema.Types.ObjectId, ref:"User",required:true}
})

export const Order = mongoose.model("Order",orderSchema);
