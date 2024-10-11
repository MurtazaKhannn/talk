import {
  Avatar,
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { FaHeart, FaLocationArrow } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import { RiChat1Fill } from "react-icons/ri";
import postsAtom from "../atoms/postsAtom";

const Post = ({ post, postedBy }) => {
  const toast = useToast();
  const curruser = useRecoilValue(userAtom);
  const [posts, setPosts] = useState(post);
  const [postss, setPostss] = useRecoilState(postsAtom);
  const currPost = postss[0];
  const [comment, setComment] = useState("");
  const [user, setUser] = useState(null); // Initializing user to null
  const [liked, setLiked] = useState(post.likes.includes(curruser?._id));
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isReplying, setisReplying] = useState(false);

  const navigate = useNavigate();

  const likedMsg = () => {
    toast({
      title: "Liked",
      description: "You have liked this post",
      status: "success",
      duration: 2000,
      isClosable: true,
    });
  };

  const handleLikeUnlike = async () => {
    try {
      const res = await fetch(`/api/posts/like/${post._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (data.error) {
        toast({
          title: "Error",
          description: "Failed to like or unlike post",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      if (!liked) {
        setPosts((prevState) => ({
          ...prevState,
          likes: [...prevState.likes, curruser._id],
        }));
        likedMsg();
      } else {
        setPosts((prevState) => ({
          ...prevState,
          likes: prevState.likes.filter((id) => id !== curruser._id),
        }));
      }

      setLiked(!liked);
    } catch {
      toast({
        title: "Error",
        description: "Failed to like or unlike post",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleComment = async () => {
    if (!user) {
      toast({
        title: "Error",
        description: "User not found",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    if (isReplying) return;
    setisReplying(true);
    try {
      const res = await fetch(`/api/posts/reply/${post._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: comment }),
      });
  
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Failed to reply to post: ${errorText}`);
      }
  
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
  
      // Assuming `data.comment` is the newly created comment object from the backend
      const newComment = data;
      console.log(newComment);
      
  
      // Update the posts to include the new comment
      setPosts((prevState) => ({
        ...prevState,
        comments: [...prevState.comments, newComment], // Add the full comment object
      }));
  
      setComment(""); // Clear the input field
      toast({
        title: "Replied",
        description: "You have replied to this post",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
      onClose(); // Close the comment modal
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setisReplying(false);
    }
  };
  

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await fetch("/api/users/profile/" + postedBy);
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
        setUser(data);
      } catch (error) {
        toast({
          title: "Error",
          description: error.message,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        setUser(null);
      }
    };

    getUser();
  }, [postedBy, toast]);

  if (!user) return null;

  
  


  const handleDeletePost = async (e) => {
    try {
      e.preventDefault();
      if(!window.confirm('Are you sure you want to delete this post?')){
        return;
      }
      const res = await fetch(`/api/posts/${post._id}` , {
        method: "DELETE",
      })
      const data = await res.json();
      if(data.error){
        toast({
          title: "Error",
          description: "Failed to delete post",
          status: "error",
          duration: 3000,
          isClosable: true,
        })
        return;
      }
      toast({
        title: "Deleted",
        description: "Post deleted" ,
        status: "success",
        duration: 2000,
        isClosable: true,
      })
      setPostss((prev) => prev.filter((p) => p._id !== currPost._id))

    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete post",
        status: "error",
        duration: 3000,
        isClosable: true,
      })
    }
  }


  const handleImageClick = (e) => {
    e.preventDefault();
    const postUrl = `/${user.username}/post/${post._id}`;
    if (window.location.pathname !== postUrl) {
      navigate(postUrl);
    }
  };

  return (
    <Link >
      <Flex gap={3} mb={4} py={5}>
        <Flex flexDirection={"column"} alignItems={"center"}>
          <Avatar
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation
              navigate(`/${user.username}`);
            }}
            size="lg"
            name={user?.name}
            src={user.profilePic}
          />
        </Flex>
        <Flex
          flexDirection={"column"}
          justifyContent={"center"}
          gap={5}
          w={"full"}
          alignItems={"center"}
        >
          <Flex
            w={"90%"}
            justifyContent={"space-between"}
            alignItems={"space-between"}
          >
            <Text
              fontSize={"md"}
              fontWeight={"bold"}
              onClick={(e) => {
                e.preventDefault();
                navigate(`/${user.username}`);
              }}
            >
              {user?.username}
            </Text>

            <Flex alignItems={"center"} gap={3}>
              <Text>{formatDistanceToNow(new Date(post.createdAt))} ago</Text>
              <Text>
                {curruser?._id === user._id && <MdDelete size={22} onClick={handleDeletePost} />}
              </Text>
            </Flex>
          </Flex>

          {post.img && (
            <Image src={post.img} rounded="md" w={"90%"} h={"full"} onClick={handleImageClick} />
          )}

          <Text>{post.text}</Text>

          <Flex
            onClick={(e) => {
              e.preventDefault();
            }}
            alignItems={"center"}
            justifyContent={""}
            gap={"20vw"}
          >
            <Flex gap={10}>
              <Text
                onClick={handleLikeUnlike}
                _hover={{ color: "red" }}
                color={liked ? "red.700" : ""}
              >
                <Flex gap={2} alignItems={"center"}>
                  <FaHeart size={22} />
                </Flex>
              </Text>
              <Text>
                <Flex gap={2} alignItems={"center"} _hover={{ color: "green" }}>
                  <Flex onClick={onOpen}>
                    <RiChat1Fill size={22} />
                  </Flex>
                  <Modal isOpen={isOpen} onClose={onClose}>
                    <ModalOverlay />
                    <ModalContent>
                      <ModalHeader>Put Your Comment Below ...</ModalHeader>
                      <ModalCloseButton />
                      <ModalBody pb={6}>
                        <FormControl>
                          <Input
                            placeholder="Comment"
                            value={comment}
                            onChange={(e) => {
                              setComment(e.target.value);
                            }}
                          />
                        </FormControl>
                      </ModalBody>

                      <ModalFooter>
                        <Button
                          colorScheme="blue"
                          mr={3}
                          onClick={handleComment}
                          isLoading={isReplying}
                        >
                          Reply
                        </Button>
                      </ModalFooter>
                    </ModalContent>
                  </Modal>
                </Flex>
              </Text>
              <Text>
                <Flex gap={2} alignItems={"center"} _hover={{ color: "blue" }}>
                  <FaLocationArrow size={20} />
                </Flex>
              </Text>
            </Flex>
          </Flex>

          <Flex gap={5}>
            <Text color={"gray.light"} fontSize="sm">
              {posts.likes.length} likes
            </Text>
            <Text color={"gray.light"} fontSize="sm">
              {posts.comments.length} Comments
            </Text>
          </Flex>

          
        </Flex>
      </Flex>
    </Link>
  );
};

export default Post;
