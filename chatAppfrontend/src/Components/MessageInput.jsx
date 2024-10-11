import { Flex, Input, InputGroup, InputRightElement, useToast } from '@chakra-ui/react'
import React, { useState } from 'react'
import { MdArrowBackIosNew, MdIosShare } from 'react-icons/md'
import { conversationsAtom, selectedConversationAtom } from '../atoms/messagesAtom';
import { useRecoilValue, useSetRecoilState } from 'recoil';

const MessageInput = ({ setMessages }) => {

  const [ messageText , setMessageText ] = useState("");
  const toast = useToast();
	const selectedConversation = useRecoilValue(selectedConversationAtom);
  const setConversations = useSetRecoilState(conversationsAtom);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if(!messageText) return ;

    try {
      const res = await fetch('/api/messages' , {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: messageText , recipientId : selectedConversation.userId}),
      })

      const data = await res.json();
      console.log(data);
      
      if(data.error){
        toast({
          title: "Error",
          description: data.error,
          status: "error",
          duration: 3000,
          isClosable: true,
        })
        return;
      }

      setMessages((messages) => [...messages , data]);

      setConversations(prevCons => {
        const updatedConversations = prevCons.map(conversation => {
          if(conversation._id === selectedConversation._id){
            return {
              ...conversation,
              lastMessage:{
                text: data.text ,
                sender: data.sender
              }
            }
          }
          return conversation;
        })
        return updatedConversations;
      })

      setMessageText("");

      toast({
        title: "Message sent successfully",
        description: "",
        status: "success",
        duration: 3000,
        isClosable: true,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      })
    }
    
  }
  return (
    <form onSubmit={handleSendMessage}>
        <InputGroup p>
        <Input w={"full"} placeholder='Send Message' onChange={(e) => setMessageText(e.target.value)} value={messageText}/>
        <InputRightElement onClick={handleSendMessage} cursor={"pointer"}>
        <MdArrowBackIosNew/>
        </InputRightElement>
        </InputGroup>
    </form>
    )
}

export default MessageInput
