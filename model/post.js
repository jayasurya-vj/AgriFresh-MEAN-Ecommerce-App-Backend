import mongoose from "mongoose";

const postSchema = mongoose.Schema({
  title:{type:String,required:true},
  content:{type:String,required:true},
  imagePath:{type:String,required:true},
  creator: {type:mongoose.Schema.Types.ObjectId, ref:"User",required:true}
})

export const Post = mongoose.model("Posts",postSchema);
