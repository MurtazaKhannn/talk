import express from "express";
import { createPost, deletePost, getPost , likeUnlikePost , replyToPost , getFeedPost , getUserPosts, getComments } from "../controllers/postController.js";
import protectRoute from "../middlewares/protectRoute.js";

const router = express.Router();


router.get("/feed" , protectRoute , getFeedPost);
router.get("/:id" , getPost);
router.get("/user/:username" , getUserPosts);
router.post("/create" , protectRoute , createPost);
router.delete("/:id" , protectRoute , deletePost);
router.put("/like/:id" , protectRoute , likeUnlikePost);
router.put("/reply/:id" , protectRoute , replyToPost);
router.get("/:id/comments" , protectRoute , getComments);




export default router;