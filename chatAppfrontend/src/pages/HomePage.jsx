import { Flex, Spinner, useToast } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import Post from '../Components/Post';

const HomePage = () => {
  const [posts , setPosts] = useState([]);
  const [loading , setLoading] = useState(true);
  const toast = useToast();
  useEffect(() => {
    const getfeedposts = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/posts/feed', {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        const data = await res.json()
        if(data.error){
          toast({
            title: "Error",
            description: data.error,
            status: "error",
            duration: 3000,
            isClosable: true,
          })
          setPosts([]); // Set empty array on error
          return;
        }
        console.log(data);
        setPosts(Array.isArray(data) ? data : []); // Ensure data is an array
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch feed posts",
          status: "error",
          duration: 3000,
          isClosable: true,
        })
        setPosts([]); // Set empty array on error
      } finally {
        setLoading(false);
      }
    } 
    getfeedposts();
  } , [toast])
  return (
    <>
    {!loading && posts.length === 0 && <h1>Follow some users to see the feed.</h1>}

    {loading && (
      <Flex justify={"center"}>
        <Spinner size = "xl" />
      </Flex>
    )}


    {posts.map((post) => (
      <Post key={post._id} post={post} postedBy={post.postedBy} />
    ))}

    </>
  )
}

export default HomePage
