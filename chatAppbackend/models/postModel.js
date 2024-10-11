import mongoose from "mongoose";

const postSchema = mongoose.Schema({
    postedBy : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User' ,
        required : true
    } , 
    text: {
        type : String ,
        maxLength : 1000 ,
        required : true
    } , 
    img : {
        type : String ,
    } ,
    likes : {
        type : [mongoose.Schema.Types.ObjectId] , //array.length = no of likes
        ref : 'User' ,
        default : []
    } ,
    comments : [
        {
            userId : {
                type : mongoose.Schema.Types.ObjectId ,
                ref : "User" ,
                required : true
            } ,
            text : {
                type : String ,
                maxLength : 1000 ,
                required : true
            } ,
            userProfilePic : {
                type : String ,
            } ,
            username : {
                type : String ,
                
            }
        }
    ]

} , {
    timestamps : true
})


const Post = mongoose.model("Post" , postSchema);

export default Post ;