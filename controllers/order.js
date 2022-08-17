import {Post} from "../model/post.js";
import {Order}  from "../model/order.js";

const createOrder=(req, res, next) => {
    console.log(req.userData.userId,req.userData)
    const url= req.protocol+"://"+req.get("host");
    const post=new Post({
      title: req.body.title,
      content: req.body.content,
      // imagePath: url+"/images/"+req.file.filename,
      creator:req.userData.userId
    });
    post.save().then(result=>{
      console.log(result);
      res.status(201).json({
        message: "success",
        post:{
          ...result,
          id:result._id
        }
      });
    }).catch(err=>{
      res.status(500).json({message:'Creating Post Failed!',error:err});
    })  
}

const getOnePost =(req, res, next) => { 
    Post.findById(req.params.id).then(post=>{
      // console.log(post);
      if(post){
        res.status(200).json({
          message: "success",
          post: post
        });
      }else{
        res.status(404).json({
          message: "failed"
        });
      }
    }).catch(err=>{
      res.status(500).json({message:'Fetching the Post failed!',error:err});
    });
}

const getOrders = (req, res, next) => {
    const pageSize=+req.query.pagesize;
    const currentPage=+req.query.page;
    const postQuery=Post.find();
    let fetchedPosts;
    if(pageSize && currentPage){
      //runs in all elements in DB. inefficient method
      postQuery.skip(pageSize*(currentPage-1))  //skips first n elements
      .limit(pageSize); 
    }
    postQuery.then(documents=>{
      fetchedPosts=documents;
        // console.log(documents);
      return Post.count();
    })
    .then(count=>{
      // console.log(count);
      res.status(200).json({
        message: "success",
        posts: fetchedPosts,
        maxPosts:count
      });
    }).catch(err=>{
      res.status(500).json({message:'Fetching Post failed!',error:err});
    });
}

export const orderController = {createOrder,getOrders};