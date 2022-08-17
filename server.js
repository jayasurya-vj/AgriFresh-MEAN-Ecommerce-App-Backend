import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";

import {postsRouter} from "./routes/posts.js";
import {userRouter} from "./routes/user.js";
import {paymentRouter} from "./routes/pay.js";
import {cartRouter} from "./routes/cart.js";
import {orderRouter} from "./routes/order.js";
import {productRouter} from "./routes/product.js";



mongoose.connect("mongodb+srv://jayasurya:"+ process.env.MONGO_PWD +"@cluster0.trotk.mongodb.net/AgriFresh-Ecommerce-App?retryWrites=true&w=majority")
.then(()=>console.log("connected successfully"))
.catch(()=>console.log("connection failed"));

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

// app.use("/",express.static(path.join("MEAN-stack-backend/angular")));
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin","*");
  res.setHeader("Access-Control-Allow-Headers","Origin,X-Requested-With,Content-Type,Accept,Authorization");
  res.setHeader("Access-Control-Allow-Methods","GET,POST,PATCH,DELETE,OPTIONS,PUT");
  next();
})

app.get("/",(req,res)=>{
  res.send("test");
});


app.use("/api/posts",postsRouter);
app.use("/api/user",userRouter);
app.use("/api/product",productRouter);
app.use("/api/cart",cartRouter);
app.use("/api/order",orderRouter);
app.use("/api/payment",paymentRouter);
// app.use("",(req,res,next)=>{
//   res.sendFile(path.json(__dirname,"angular","index.html"));
// });


app.listen(process.env.PORT || 5000);




