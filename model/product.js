import mongoose from "mongoose";
import uniqueValidator from "mongoose-unique-validator";

const productSchema = mongoose.Schema({
    name:{type:String,required:true,unique:true},
    displayQuantity:{type:String,required:true},
    price:{type:Number,required:true}
})

productSchema.plugin(uniqueValidator);

export const Product = mongoose.model("Product",productSchema);
