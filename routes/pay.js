import express from "express";
import {payController} from "../controllers/pay.js";
import {checkAuth} from "../middleware/check-auth.js";

export const paymentRouter = express.Router();
paymentRouter.get("", checkAuth, payController.payWithStripe);
paymentRouter.get("/success", payController.paymentSuccess);