import {
  Avatar,
  Divider,
  Flex,
  Spinner,
  useToast,
} from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import Post from "../Components/Post"; // Import the Post component
import userGetProfile from "../hooks/userGetProfile";
import Comments from "../Components/Comments";
import postsAtom from "../atoms/postsAtom";

const PostPage = () => {
  const curruser = useRecoilValue(userAtom);
  const { user, loading } = userGetProfile();
  const [post, setPost] = useState(null);
  const [posts , setPosts] = useRecoilState(postsAtom);
  const [comments, setComments] = useState([]); // Initialize comments as an empty array
  const toast = useToast();
  const { pid } = useParams();

  const currPost = posts.find(post => post._id === pid);

  

  // Fetch the post
  useEffect(() => {
    const getPost = async () => {
      try {
        console.log(`Fetching post with ID: ${pid}`); // Log the post ID being fetched
        const res = await fetch(`/api/posts/${pid}`);
        const data = await res.json();
        if (data.error) {
          toast({
            title: "Error",
            description: data.error,
            status: "error",
            duration: 3000,
            isClosable: true,
          });
          return;
        }
        setPosts([data]); // Set the post
        console.log("Post fetched successfully:", data); // Log the fetched post
      } catch (error)    {
        toast({
          title: "Error",
          description: error.message,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    };

    getPost();
  }, [pid, toast , setPosts]); // Fetch post only when 'pid' changes

  // Fetch comments after post is available
  // useEffect(() => {
  //   const fetchComments = async () => {
  //     if (!currPost?._id) {
  //       console.log("Post not yet available, skipping comment fetch");
  //       return; // Only fetch comments if the post is loaded
  //     }

  //     try {
  //       console.log(`Fetching comments for post ID: ${currPost._id}`); // Log the post ID used to fetch comments
  //       const res = await fetch(`/api/posts/${currPost._id}/comments`);
  //       const data = await res.json();
  //       if (!res.ok || data.error) {
  //         toast({
  //           title: "Error",
  //           description: data.error || "Failed to fetch comments",
  //           status: "error",
  //           duration: 3000,
  //           isClosable: true,
  //         });
  //         return;
  //       }
  //       setComments(data.comments); // Set the comments array
  //       console.log("Comments fetched successfully:", data.comments); // Log the fetched comments
  //     } catch (error) {
  //       toast({
  //         title: "Error",
  //         description: error.message,
  //         status: "error",
  //         duration: 3000,
  //         isClosable: true,
  //       });
  //     }
  //   };

  //   if (currPost) {
  //     fetchComments(); // Fetch comments only after the post is fetched
  //   }
  // }, [currPost, toast]); // Fetch comments when post changes

  // Render loading spinner while fetching user or post data
  if (loading || !currPost) {
    return (
      <Flex justifyContent={"center"}>
        <Spinner size={"xl"} />
      </Flex>
    );
  }

  if(!currPost) return null;


  return (
    <>
      {/* Render Post */}
      <Post post={currPost} postedBy={currPost.postedBy} />

      <Divider my={5} />

      {/* Render Comments */}
      {currPost.comments.length > 0 ? (
        currPost.comments.map((comment) => (
          <Comments key={comment._id} comment={comment} />
        ))
      ) : (
        <p>No comments available</p>
      )}
    </>
  );
};

export default PostPage;
