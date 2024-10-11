import Post from "../models/postModel.js";
import User from "../models/userModel.js";
import {v2 as cloudinary} from "cloudinary";


const createPost = async (req , res) => {
    try {
        const { postedBy , text } = req.body ; //jo post kr rha hai uski id postedBy hai and refernce uska user se leliya gya hai
        let { img } = req.body ;
        if(!postedBy || !text) {
            return res.status(400).json({ error : "Posted By and text is not present." });
        }
       

        const user = await User.findById(postedBy);
        if(!user) {
            return res.status(400).json({ error : "User not found." });
        }

        if(user._id.toString() !== req.user._id.toString()){
            return res.status(401).json({ error : "You are not authorized to create a post." });
        }

        const maxLength = 1000 ;
        if(text.length > maxLength){
            return res.status(400).json({ error : `Text should not exceed ${maxLength} characters.`});
        }

        if(img){
            const uploadedResponse = await cloudinary.uploader.upload(img);
            img = uploadedResponse.secure_url;
        }

        const newPost = new Post({
            postedBy ,
            text , 
            img
        })

        await newPost.save();
        res.status(500).json(newPost)

    } catch (error) {
        res.status(500).json({ message : error.message });
        console.log("Error in createPost :" , error.message);
    }
}


const getPost = async (req, res) => {

    try {
        const post = await Post.findById(req.params.id);
        if(!post){
            return res.status(404).json({ error : "Post not found." });
        }

        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ error : error.message });
        console.log("Error in getPost :" , error.message);
    }
    
}



const deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if(!post){
            res.status(404).json({ error : "Post not found" })
        }

        if(post.postedBy.toString()!== req.user._id.toString()){
            return res.status(401).json({ error : "You are not authorized to delete this post." });
        }

        if(post.img) {
            const imgId = post.img.split("/").pop().split(".")[0];
            await cloudinary.uploader.destroy(imgId);
        }

        await Post.findByIdAndDelete(req.params.id);

        res.status(200).json({ message : "Post deleted successfully" });
    } catch (error) {
        res.status(500).json({ error : error.message });
    }
}



const likeUnlikePost = async (req, res) => {

    try {

        
        const { id : postId } = req.params ;
        const userId = req.user._id ;

        const post = await Post.findById(postId);

        if(!post) {
            return res.status(404).json({ error : "Post not found." });
        }

        const userLikedPost = post.likes.includes(userId);

        if(userLikedPost){
            //Unlike
            await Post.updateOne({_id:postId} , {$pull: {likes:userId}})
            res.status(200).json({ message : "Post Unliked successfully" });
        } else {
            //Like
            post.likes.push(userId);
            await post.save();
            res.status(200).json({ message : "Post Liked successfully" });
        }
    } catch (error) {
        res.status(500).json({ error : error.message });
        console.log("Error in likeUnlikePost :" , error.message);
    }
}



const replyToPost = async (req, res) => {
    try {
        const { text } = req.body;
        const postId = req.params.id ;
        const userId = req.user._id ;
        const userProfilePic = req.user.profilePic ;
        const username = req.user.username ;

        if(!text){
            return res.status(400).json({ error : "Reply text is required." });
        }

        const post = await Post.findById(postId);

        if(!post){
            return res.status(404).json({ error : "Post not found." });
        }

        const comment = { userId , text , userProfilePic , username } ;

        post.comments.push(comment);
        await post.save();

        res.status(200).json(comment);
        
    } catch (error) {
        res.status(500).json({ error : error.message });
        console.log("Error in replyToPost :" , error.message);
    }
}

const getComments = async (req , res) => {
    try {
        const { id } = req.params ; 

        const post = await Post.findById(id);

        if(!post){
            return res.status(404).json({ error : "Post not found." });
        }
        
        res.status(200).json({ comments: post.comments });

    } catch (error) {
        res.status(500).json({ error : error.message });
        console.log("Error in getComments :" , error.message);
    }
}



const getFeedPost = async (req, res) => {

    try {
        const userId = req.user._id;
        const user = await User.findById(userId);
        if(!user){
            return res.status(400).json({ error : "User not found." });
        }

        const following = user.following;

        const feedPosts = await Post.find({postedBy: {$in : following}}).sort({createdAt: -1});
        res.status(200).json( feedPosts );
    } catch (error) {
        res.status(500).json({ error : error.message });
        console.log("Error in getFeedPost :" , error.message);
    }
}


const getUserPosts = async (req, res) => {
    const { username } = req.params;
    try {
        const user = await User.findOne({ username: username });
        if(!user){
            return res.status(404).json({ error : "User not found." });
        }

        const posts = await Post.find({ postedBy: user._id }).sort({ createdAt: -1 });
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ error : error.message });
    }
}


export { createPost , getPost , deletePost , likeUnlikePost , replyToPost , getFeedPost , getUserPosts , getComments };
 
