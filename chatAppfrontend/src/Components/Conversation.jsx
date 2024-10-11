import {
  Avatar,
  AvatarBadge,
  Box,
  Flex,
  Image,
  Stack,
  Text,
  useColorModeValue,
  WrapItem,
} from "@chakra-ui/react";
import React from "react";
import userAtom from "../atoms/userAtom";
import { useRecoilState, useRecoilValue } from "recoil";
import { FaCheckDouble } from "react-icons/fa6";
import { selectedConversationAtom } from "../atoms/messagesAtom";

const Conversation = ({ conversation, isOnline }) => {
  const currentUser = useRecoilValue(userAtom);
  // const lastMessage = conversation.lastMessage ;
  const [selectedConversation, setSelectedConversation] = useRecoilState(
    selectedConversationAtom
  );
  const colorMode = useColorModeValue();
  // console.log("selectedConversation", selectedConversation);

  return (
    <div>
      <Flex
        gap={4}
        alignItems={"center"}
        p={"1"}
        _hover={{
          cursor: "pointer",
          bg: useColorModeValue("gray.900", "gray.dark"),
          color: "white",
        }}
        onClick={() => {
          setSelectedConversation({
            _id: conversation._id,
            userId: conversation.participants[0]._id,
            userProfilePic: conversation.participants[0].profilePic,
            username: conversation.participants[0].username,
            mock: conversation.mock,
          });
        }}
        bg={
          selectedConversation?._id === conversation._id
            ? colorMode === "light"
              ? "gray.100"
              : "gray.dark"
            : ""
        }
        color={selectedConversation?._id === conversation._id ? "white" : ""}
        borderRadius={"md"}
      >
        <WrapItem>
          <Avatar
            size={{
              base: "xs",
              sm: "sm",
              ms: "md",
            }}
            src={conversation?.participants[0]?.profilePic}
          >
            {isOnline ? <AvatarBadge boxSize="1em" bg={"green.500"} /> : ""}
          </Avatar>
        </WrapItem>

        <Stack direction={"column"} fontSize={"sm"}>
          <Text display={"flex"} fontWeight={"bold"} alignItems={"center"}>
            {conversation?.participants[0]?.username}{" "}
            {/* <Image src="/verified.png" w={"4"} h={"4"} ml={"1"} /> */}
          </Text>
          <Text
            fontSize={"xs"}
            display={"flex"}
            alignItems={"center"}
            gap={"1"}
          >
            {currentUser._id === conversation.lastMessage.sender && (
              <Box color={conversation.lastMessage.seen ? "blue.400" : ""}>
                <FaCheckDouble  />
              </Box>
            )}
            {conversation.lastMessage.text.length > 16
              ? conversation.lastMessage.text.substring(0, 16) + " . . ."
              : conversation.lastMessage.text}
          </Text>
        </Stack>
      </Flex>
    </div>
  );
};

export default Conversation;
