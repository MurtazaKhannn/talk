import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    name : {
        type : String ,
        required : true
    } ,
    username : {
        type : String ,
        required : true ,
        unique : true
    } , 
    email : {
        type : String ,
        required : true ,
        unique : true
    } , 
    password : {
        type : String ,
        minlength : 8 ,
        required : true
    } ,
    profilePic : {
        type : String ,
        default : ""
    } , 
    followers : {
        type : [String] ,
        default : []
    } , 
    following  :{
        type : [String] ,
        default : []
    } ,
    aboutMe : {
        type : String ,
        default : ""
    }
} , {
    timestamps : true
}) ;

const User = mongoose.model("User" , userSchema)

export default User ;
