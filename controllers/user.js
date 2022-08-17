import {User} from "../model/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


const createUser= (req, res, next) => { 
    console.log(req.body)
    bcrypt.hash(req.body.password, 10)
    .then(hash=>{
        const user=new User({
            email: req.body.email,
            password: hash
        });
        user.save()
          .then(result=>{
              res.status(200).json({message:'Success',result:result});
          })
          .catch(err=>{
            res.status(500).json({message:'Invalid Authentication Credetials!',error:err});
          })
    })
}

const loginUser = (req, res, next) => { 
    let authUser;
    User.findOne({email:req.body.email}).then(user=>{
        if(!user){
            return res.status(401).json({message:"Invalid Authentication Credetials!"});
        }
        authUser=user;
        return bcrypt.compare(req.body.password,user.password);
    }).then(result=>{
        console.log(result);
        if(!result){
            return res.status(401).json({message:"Invalid Authentication Credetials!"});
        }
        const token = jwt.sign({email:authUser.email, userId:authUser._id},
            process.env.JWT_SECRET,
            {expiresIn: "1h"});
        res.status(200).json({message:'Success',token:token, expiresIn:3600, userId:authUser._id});

    }).catch(err=>{
        return res.status(401).json({message:"Invalid Authentication Credetials!", error:err});
    })
}

export const userController = {createUser,loginUser};