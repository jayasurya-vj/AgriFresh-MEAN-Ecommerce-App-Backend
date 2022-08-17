import express from "express";
import {payController} from "../controllers/pay.js";
import {checkAuth} from "../middleware/check-auth.js";
import bodyParser from "body-parser";

export const paymentRouter = express.Router();
// checkAuth
paymentRouter.get("",  payController.payWithStripe);
paymentRouter.get("/success",  payController.paymentSuccess);
// paymentRouter.post('/webhook', bodyParser.raw({type: 'application/json'}),payController.stripeWebhook);
