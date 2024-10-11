import { SearchIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  Input,
  Skeleton,
  SkeletonCircle,
  Text,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import Conversation from "../Components/Conversation";
import { SiChatwoot } from "react-icons/si";
import MessageContainer from "../Components/MessageContainer";
import { useRecoilState, useRecoilValue } from "recoil";
import { conversationsAtom, selectedConversationAtom } from "../atoms/messagesAtom";
import userAtom from "../atoms/userAtom";
import { useSocket } from "../../context/SocketContext";

const ChatPage = () => {
  const toast = useToast();
  const [conversations, setConversations] = useRecoilState(conversationsAtom);
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [selectedConversation, setSelectedConversation] = useRecoilState(selectedConversationAtom);
  const [searchText , setSearchText] = useState('');
  const [searchingUser , setSearchingUser] = useState(false);
  const currentUser = useRecoilValue(userAtom);
  const {socket, onlineUsers} = useSocket();


  useEffect(() => {
    socket?.on("messagesSeen" , ({ conversationid }) => {
      setConversations(prev => {
        const updatedConversations = prev.map(conversation => {
          if (conversation._id === conversationid) {
            return {
             ...conversation,
              lastMessage:{
                 ...conversation.lastMessage,
                  seen: true,
              },
            };
          }
          return conversation;
        });
        return updatedConversations;
      })
    })
  } , [socket , setConversations])



  useEffect(() => {
    const getConversations = async () => {
      try {
        const res = await fetch("/api/messages/conversations");        

        const data = await res.json();
        if (data.error) {
          toast({
            title: "Error",
            description: data.error,
            status: "error",
            duration: 3000,
          });
          return;
        }

        console.log(data);

        data.forEach(conversation => {
          console.log('Last Message:', conversation.lastMessage);
        });

        setConversations(data);

        setConversations(prevCons => {
          const updatedConversations = prevCons.map(conversation => {
            if (conversation._id === selectedConversation._id) {
              return {
                ...conversation,
                lastMessage: {
                  text: conversation.lastMessage.text, // Ensure this is the message text you want
                  sender: conversation.lastMessage.sender  // Ensure this is the correct sender ID
                }
              }
            }
            return conversation;
          });
          return updatedConversations;
        });
        
        
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch conversations",
          status: "error",
          duration: 3000,
        });
      } finally {
        setLoadingConversations(false);
      }
    };

    getConversations();
  }, [setConversations , toast]);

  const handleConversationSearch = async (e) => {
    e.preventDefault();
    setSearchingUser(true);
    try {
      const res = await fetch(`/api/users/profile/${searchText}`);
      const searchedUser = await res.json();
      if (searchedUser.error) {
        toast({
          title: "Error",
          description: "User not found",
          status: "error",
          duration: 3000,
        });
        setSearchingUser(false);
        return;
      }

      if(searchedUser._id == currentUser._id){
        toast({
          title: "Error",
          description: "You can't start a conversation with yourself",
          status: "error",
          duration: 3000,
        });
        setSearchingUser(false);
        return;
      }

      if(conversations.find(conversation => conversation.participants[0]._id === searchedUser._id)){
        setSelectedConversation({
          _id : conversations.find(conversation => conversation.participants[0]._id === searchedUser._id)._id,
          userId: searchedUser._id,
          username: searchedUser.username,
          userProfilePic: searchedUser.profilePic
        })
        return ;
      }

      const mockConversation = {
        mock: true,
        lastMessage: {
          text: "",
          sender: ""
        },
        _id: Date.now(),
        participants: [
          {
            _id: searchedUser._id,
            username: searchedUser.username,
            profilePic: searchedUser.profilePic,
          }
        ]
      }

      setConversations((prevConvs) => [...prevConvs , mockConversation])



    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to search for user",
        status: "error",
        duration: 3000,
      })
    } finally {
      setSearchingUser(false);
    }
  }

  return (
    <Box
      position={"absolute"}
      left={"50%"}
      w={{
        base: "100%",
        md: "80%",
        lg: "750px",
      }}
      p={4}
      transform={"translateX(-50%)"}
    >
      <Flex
        gap={4}
        flexDirection={{
          base: "column",
          md: "row",
        }}
        maxWidth={{
          sm: "400px",
          md: "full",
        }}
        mx={"auto"}
      >
        <Flex
          flex={30}
          gap={2}
          flexDirection={"column"}
          maxW={{
            sm: "250px",
            md: "full",
          }}
          mx={"auto"}
        >
          <Text
            fontWeight={700}
            color={useColorModeValue("gray.600", "gray.400")}
          >
            Your Conversations
          </Text>

          <form onSubmit={handleConversationSearch}>
            <Flex alignItems={"center"} gap={2}>
              <Input placeholder="Search User" onChange={(e) => setSearchText(e.target.value)} />
              <Button onClick={handleConversationSearch} isLoading={searchingUser} size={"sm"}>
                <SearchIcon />
              </Button>
            </Flex>
          </form>

          {loadingConversations &&
            [0, 1, 2, 3, 4].map((_, i) => (
              <Flex
                key={i}
                gap={4}
                alignItems={"center"}
                p={"1"}
                borderRadius={"md"}
              >
                <Box>
                  <SkeletonCircle size={"10"} />
                </Box>
                <Flex w={"full"} flexDirection={"column"} gap={"3"}>
                  <Skeleton h={"10px"} w={"80px"} />
                  <Skeleton h={"8px"} w={"90%"} />
                </Flex>
              </Flex>
            ))}

          {conversations.map((conversation) => (
            <Conversation key={conversation._id} isOnline={onlineUsers.includes(conversation.participants[0]?._id)} conversation={conversation}  />
          ))}
        </Flex>

        {!selectedConversation._id && (
          <Flex
            flex={70}
            borderRadius={"md"}
            p={2}
            flexDirection={"column"}
            alignItems={"center"}
            justifyContent={"center"}
            height={"400px"}
          >
            <SiChatwoot size={80} />
            <Text alignItems={"center"} mt={4} justifyContent={"center"} fontSize={20}>
              Select a Conversation to start messaging.
            </Text>
          </Flex>
        )}

        {/* <Flex flex={70}>Message</Flex> */}
        {selectedConversation._id && <MessageContainer />}
        
      </Flex>
    </Box>
  );
};

export default ChatPage;
