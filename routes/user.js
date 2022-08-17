import express from "express";
import {userController} from "../controllers/user.js"
import bodyParser from "body-parser";

export const userRouter = express.Router();

userRouter.post("/signup",userController.createUser);

userRouter.post("/login",userController.loginUser);
