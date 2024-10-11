import React, { useEffect, useState } from 'react'
import UserHeader from '../Components/UserHeader'
import UserPost from '../Components/UserPost'
import all_posts from '../assets/allposts'
import { useParams } from 'react-router-dom'
import { Flex, Spinner, useToast } from '@chakra-ui/react'
import Post from '../Components/Post'
import userGetProfile from '../hooks/userGetProfile'
import { useRecoilState, useRecoilValue } from 'recoil'
// import userAtom from '../atoms/userAtom'
import postsAtom from '../atoms/postsAtom'

const UserPage = () => {
  const { user , loading } = userGetProfile();

  const toast = useToast();

  
  // const [user, setUser] = useState(null);
  const [posts, setPosts] = useRecoilState(postsAtom);
  const [fetchingPost , setfetchingPost] = useState(true);

  const { username } = useParams();

  useEffect(() => {
    


    const getPost = async () => {
      setfetchingPost(true);
      try {
        const res = await fetch(`/api/posts/user/${username}` , {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        })
        const data = await res.json();
        console.log(data);
        setPosts(data);
        
      } catch (error) {
        toast({
          title: "Error",
          description: error.message,
          status: "error",
          duration: 3000,
          isClosable: true,
        })
        setPosts([]);
      } finally {
        setfetchingPost(false);
      }
    }

    getPost();
  }, [username , toast , setPosts]);

  console.log("posts is here and it is recoil state" , posts);
  

  if(!user && loading){
    return (
      <Flex justifyContent={'center'} alignItems={'center'}>
        <Spinner size={'xl'}  />
      </Flex>
    )
  }

  if(!user && !loading){
    return (
    <h1>User not found.</h1>
  )
  }



  if(!user) return null ;

  return (
    <>
    <UserHeader user={user} />
    {!fetchingPost && posts.length === 0 && <h1>{user.name} has no posts.</h1>}
    {fetchingPost && (
      <Flex justify={'center'} my={12} alignItems={'center'}>
        <Spinner size={'xl'}  />
      </Flex>
    )}

    {posts.map((post) => (
      <Post key={post._id} post={post} postedBy={post.postedBy} setPosts={setPosts} />
    ))}
    </>
  )
}

export default UserPage ;
