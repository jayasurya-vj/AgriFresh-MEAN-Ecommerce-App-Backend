import express from "express";
import {orderController} from "../controllers/order.js";
import {checkAuth} from "../middleware/check-auth.js";

export const orderRouter = express.Router();

orderRouter.post("", checkAuth, orderController.createOrder);

orderRouter.get("", checkAuth, orderController.getOrders);


