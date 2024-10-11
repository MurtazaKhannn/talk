import { Avatar, Divider, Flex, Text, color } from "@chakra-ui/react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaHeart } from "react-icons/fa";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const Comments = (props) => {
  const [liked, setliked] = useState(false);

  
  return (
    <>
      <Flex
        w={"full"}
        flexDirection={"column"}
        gap={5}
        justifyContent={"center"}
      >
        <Flex w={"full"} alignItems={"center"} justifyContent={"space-between"}>
          <Flex alignItems={"center"} gap={3}>
            <Avatar src={props.comment.userProfilePic} name="Mohit Arora" />
            <Text fontWeight={"bold"}>{props.comment.username}</Text>
          </Flex>
          <Flex fontSize={"sm"} alignItems={"center"} gap={3}>
            <Text>2 d</Text>
            <Text>
              {" "}
              <BsThreeDotsVertical />{" "}
            </Text>
          </Flex>
        </Flex>

        <Flex flexDirection={"column"} gap={2}>
          <Text fontSize={"sm"}>{props.comment.text}</Text>
        </Flex>
      </Flex>

      <Divider my={5}></Divider>
    </>
  );
};

export default Comments;
