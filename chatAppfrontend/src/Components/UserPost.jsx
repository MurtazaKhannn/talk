import { Avatar, Box, Flex, Image, Text, Toast, useToast} from '@chakra-ui/react'
import MMK from "../assets/mmk.jpg"
import { FaHeart } from "react-icons/fa";
import { FaLocationArrow } from "react-icons/fa";
import { BiSolidMessageSquare } from "react-icons/bi";
import { BsThreeDotsVertical } from "react-icons/bs";
import { Link } from "react-router-dom"
import VW from "../assets/pic-view.avif"
import React, { useState } from 'react'
import { color } from 'framer-motion';

const UserPost = (props) => {
    const toast = useToast()
    const [liked, setliked] = useState(false)
    const likedMsg = () => {
        toast({
            title: "Liked",
            description: "You have liked this post",
            status: "success",
            duration: 2000,
            isClosable: true,
        })
    }
  return (
    <Link to={"/murtaza/post/1"} >
        <Flex gap={3} mb={4} py={5}>
            <Flex flexDirection={"column"} alignItems={"center"}>
                <Avatar size="lg" name='Murtaza' src={props.user.profile_pic}/>
                 
                
            </Flex>
            <Flex flexDirection={"column"} justifyContent={"center"} gap={5} w={"full"} alignItems={"center"}>
                <Flex w={"90%"} justifyContent={"space-between"} alignItems={"space-between"}>
                    <Text>{props.title}</Text>
                    <Flex alignItems={"center"} gap={3}>
                        <Text>{props.days}d</Text>
                        <Text><BsThreeDotsVertical /></Text>
                    </Flex>
                    
                </Flex>
                
                {props.image && <Image src={props.image} rounded="md" w={"90%"} h={"full"}/>}
                
                <Text  >{props.caption}</Text>

                <Flex onClick={(e) => {e.preventDefault()}} gap={10}>
                    <Text onClick={() => {setliked(!liked); {liked=== true ? "" : likedMsg() }}} _hover={{color:"red"}} color={liked === true ? "red.700" : ""} > <Flex gap={2} alignItems={"center"}  > <FaHeart /> {console.log(liked)} </Flex>  </Text>
                    <Text  > <Flex gap={2} alignItems={"center"} _hover={{color:"green"}} ><BiSolidMessageSquare /></Flex></Text>
                    <Text  > <Flex gap={2} alignItems={"center"} _hover={{color:"blue"}} ><FaLocationArrow /></Flex></Text>
                </Flex>

                <Flex gap={5}>
                    <Text color={"gray.light"} fontSize="sm">{props.likes} likes</Text>
                    <Text color={"gray.light"} fontSize="sm">{props.comments} Comments</Text>
                </Flex>

            </Flex>
        </Flex>
        
    </Link>
    
    
  )
}

export default UserPost
