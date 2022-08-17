import {Post} from "../model/post.js";

const createPost=(req, res, next) => {
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

const editPost = (req, res, next) => {
    const url= req.protocol+"://"+req.get("host");
    // let imagePath=req.body.imagePath;
    // if(req.file){
    //   imagePath= url+"/images/"+req.file.filename;
    // }
    const post=new Post({
      _id:req.params.id,
      title:req.body.title,
      content:req.body.content,
      // imagePath:imagePath,
      creator:req.userData.userId
    });
    Post.updateOne({_id:req.params.id,creator:req.userData.userId},post).then(result=>{
      // console.log(result);
      if(result.modifiedCount>0 || result.matchedCount>0){
        res.status(200).json({
          message: "success"
      }) 
      }else{
        res.status(401).json({
          message: "You are not Authorized to perform the action!"
      }) 
      }
     }).catch(err=>{
      res.status(500).json({message:'Updating the Post Failed!',error:err});
    });
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

const getPosts = (req, res, next) => {
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

const deletePost = (req, res, next) => {
    Post.deleteOne({_id:req.params.id,creator:req.userData.userId}).then(result=>{
    // console.log(result);
    if(result.deletedCount>0){
      res.status(200).json({
        message: "success"
    }) 
    }else{
      res.status(401).json({
        message: "You are not Authorized to perform the action!"
    }) 
    }
    }).catch(err=>{
    res.status(500).json({message:'Couldn\'t delete post!',error:err});
    });
}

export const postController = {createPost,editPost,getOnePost,getPosts,deletePost};