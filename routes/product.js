import express from "express";
import {productController} from "../controllers/product.js"

export const productRouter = express.Router();

productRouter.get("", productController.getProducts);

productRouter.post("", productController.addProduct);


