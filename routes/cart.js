import express from "express";
import {cartController} from "../controllers/cart.js";
import {checkAuth} from "../middleware/check-auth.js";

export const cartRouter = express.Router();

cartRouter.get("",checkAuth,  cartController.getCart);

cartRouter.post("",checkAuth, cartController.addCartItem);

cartRouter.put("/:id", checkAuth, cartController.editCartItem);

cartRouter.delete("/:id", checkAuth,  cartController.deleteCartItem);

cartRouter.delete("", checkAuth, cartController.deleteCart);


