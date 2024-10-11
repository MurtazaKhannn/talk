import { Avatar, Box, Flex, Text } from '@chakra-ui/react'
import React from 'react'
import { useRecoilValue } from 'recoil'
import { selectedConversationAtom } from '../atoms/messagesAtom'
import userAtom from '../atoms/userAtom'
import { BsCheck2All } from "react-icons/bs";


const Message = ({ message , ownMessage }) => {

    const selectedConversation = useRecoilValue(selectedConversationAtom);
    const user = useRecoilValue(userAtom);
    // console.log(user);
    
    return (
        <>
            {ownMessage ? (
                <Flex gap={2} alignSelf={"flex-start"} >
                    <Avatar src={user.profilePic} w={"7"} h={"7"} />
                    {/* <Text max={"350px"} bg={"gray.100"} color={"black"} p={1} borderRadius={"md"} >
                        {message.text}
                    </Text> */}

                    <Flex bg={"green.600"} maxW={"350px"} p={1} borderRadius={"md"}>
                        <Text color={"white"}>{message.text}</Text>
                        <Box alignSelf={"flex-end"} ml={1} color={message.seen ? "blue.400" : ""} fontWeight={"bold"}>
                            <BsCheck2All />
                        </Box>
                    </Flex>
                    
                </Flex>) : (
                    <Flex alignSelf={"flex-end"} gap={2}  >
                    <Text max={"350px"} bg={"gray.300"} p={1} borderRadius={"md"} color={"black"} >
                        {message.text}
                    </Text>
                    <Avatar src={selectedConversation.userProfilePic}  w={"7"} h={"7"} />
                </Flex>
                )}

        </>
    )
}

export default Message
