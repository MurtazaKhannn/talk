import { Box, Flex, Text, VStack, Avatar, Menu, MenuButton, MenuItem, Portal, MenuList, useToast , ChakraProvider, Button, Link} from '@chakra-ui/react';
import React, { useState } from 'react';
import MMK from "../assets/mmk.jpg";
import { FaInstagram} from "react-icons/fa";
import { IoIosMore } from "react-icons/io";
import { motion } from 'framer-motion';
import { useRecoilValue } from 'recoil';
import { Link as RouterLink } from 'react-router-dom';
import userAtom from '../atoms/userAtom';

const MotionBox = motion(Box);
const UserHeader = ({ user }) => {
  const currentUser = useRecoilValue(userAtom); //logged in user
  const [following , setFollowing] = useState(user.followers.includes(currentUser?._id))
  const [updating , setUpdating] = useState(false)
  const toast = useToast()

  const handleFollow = async () => {
    if(!currentUser){
      toast({
        title: "Error",
        description: "You need to be logged in to follow users",
        status: "error",
        duration: 3000,
        isClosable: true,
      })
      return ;
    }

    if(updating) return ;
    setUpdating(true);
    try {
      const res = await fetch(`/api/users/follow/${user._id}` , {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      })

      const data = await res.json();
      console.log(data);
      if(data.error) {
        toast({
          title: "Error",
          description: "Failed to follow user",
          status: "error",
          duration: 3000,
          isClosable: true,
        })
        return ;
      }

      if(following){
        toast({
          title: "Success",
          description: `${user.username} Unfollowed successfully`,
          status: "success",
          duration: 3000,
          isClosable: true,
        })

        user.followers.pop();
      } else {
        toast({
          title: "Success",
          description: `${user.username} followed successfully`,
          status: "success",
          duration: 3000,
          isClosable: true,
        })

        user.followers.push(currentUser?._id);
      }
      setFollowing(!following)
      
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to follow user",
        status: "error",
        duration: 3000,
        isClosable: true,
      })
    } finally {
      setUpdating(false);
    }
  }

  const copyURL = () => {
    const currentURL = window.location.href;
    navigator.clipboard.writeText(currentURL).then(() => {
      toast({ description: 'Profile Link Copied to clipboard'})
    });
  }
  return (
    <VStack gap={4} alignItems="start" w="full" fontFamily={"oswald"}>
      <Flex justifyContent="space-between" w="full">
        <Box>
          <Text fontWeight={"bold"} fontSize="3xl">
            {user.name}
          </Text>
          <Flex gap={2} alignItems="center">
            <Text fontSize="sm" bg="#000000" color="#ffffff" p={1} rounded="md">
              {user.username}
            </Text>
            <Text bg={"#ffffff"} color={"gray.700"} rounded="md" p={1} fontSize="sm">
              {}
            </Text>
          </Flex>
        </Box>
        <Box>
          <Avatar
            name={user.name}
            src={user.profilePic}
            size="xl"
          />
        </Box>
      </Flex>

      <Flex w={"full"} alignItems={"center"} justifyContent={"space-between"}>
        <Flex>
          <Text _hover={{ color: "gray.dark" }} color={"gray.light"}>{user.followers.length} Followers</Text>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <Text _hover={{color:"gray.dark"}} color={"gray.light"}>{user.following.length} Following</Text>
        </Flex>
        <Flex gap={3}>
          <MotionBox
            drag
            cursor="pointer"
            _hover={{ color: "gray.700"}}
            whileHover={{ scale: 1.2 , rotate:20} } 
            transition={{ duration: 0.5, repeat:Infinity , repeatType: "reverse"  }} 
            
          >
            <FaInstagram size={25} />
          </MotionBox>
          <Box>
            <Menu>
              <MenuButton >
                <IoIosMore cursor={"pointer"} size={25} />
              </MenuButton>
              <Portal>
                <MenuList bg={"gray.dark"} border={"none"}>
                <MenuItem bg={"gray.dark"} color={"#ffffff"} onClick={copyURL}> Copy Link </MenuItem>
                </MenuList>
              </Portal>
            </Menu>
          </Box>
        </Flex>
      </Flex>

      <Text>about Me : {user.aboutMe}</Text>

      {currentUser?._id === user._id && (
        <Link as={RouterLink} to={`/update/${user._id}`}>
        <Button size={"sm"} >Update Profile</Button>
        </Link>
      )}

      {currentUser?._id !== user._id && (
        <Button size={"sm"} onClick={handleFollow} isLoading={updating} >
          {following ? "Unfollow" : "Follow"}
        </Button>
      )}

      <Flex w={"full"} >
        <Flex flex={1} borderBottom={"1.5px solid #ffffff"} justifyContent={"center"} pb={"3"} cursor={"pointer"}>
          <Text fontWeight={"bold"}>Posts/Speaks</Text>
        </Flex>
        {/* <Flex flex={1} borderBottom={"1.5px solid #ffffff"} justifyContent={"center"} pb={"3"} cursor={"pointer"}>
          <Text fontWeight={"bold"}>Posts</Text>
        </Flex> */}
      </Flex>
      

    </VStack>
  );
}

export default UserHeader;


