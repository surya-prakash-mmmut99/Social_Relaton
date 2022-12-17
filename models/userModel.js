
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {type:String,required:true},
  userauth: {type:String,required:true,unique:true},
  password: {type:String,required:true},
  imageprofile: {type:String,required:true},
  imagecover: {type:String,required:true},
  following: {type:Array,default:[]},
  followers: {type:Array,default:[]}

},{
    timestamps:true,
});

const User = mongoose.model('User',userSchema);
export default User;