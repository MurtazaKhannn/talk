import {
  Button,
  CloseButton,
  Flex,
  FormControl,
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
  Textarea,
  useColorMode,
  useColorModeValue,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { AiOutlineDingtalk } from "react-icons/ai";
import { MdAddAPhoto } from "react-icons/md";
import React, { useRef, useState } from "react";
import userAtom from "../atoms/userAtom";
import { useRecoilState, useRecoilValue } from "recoil";
import postsAtom from "../atoms/postsAtom";
import { useParams } from "react-router-dom";

const CreatePost = () => {
  const MAX_CHAR = 1000;

  const toast = useToast();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [postText, setPostText] = useState("");
  const [imgUrl, setImgUrl] = useState(null);
  const [remainingChars, setRemainingChars] = useState(MAX_CHAR);
  const user = useRecoilValue(userAtom);
  const imageRef = useRef(null);
  // const [posts , setPosts] = useState([]);
  const [loading , setLoading] = useState(false);
  const [posts , setPosts] = useRecoilState(postsAtom);
  const{ username } = useParams();


  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImgUrl(reader.result);
        console.log(imgUrl);
      }; 
      reader.readAsDataURL(file);
      console.log(imgUrl);
    } else {
      toast({
        title: "Invalid file Type",
        description: "Please select an image file (jpg, png)",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      setImgUrl(null);
      // console.log(imgUrl);
    }
  };

  const handleCreatePost = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/posts/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postedBy: user._id,
          text: postText,
          img: imgUrl,
        }),
      });
  
      const data = await res.json();
      console.log(data);
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
  
      toast({
        title: "Success",
        description: "Post created successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      if(username === user.username){
        setPosts([ data,...posts] );
      }
      // setPosts([ data , ...posts] );
      onClose();
      setPostText("");
      setImgUrl("");
    } catch (error) {
      toast({
        title: "Error",
        description: error,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };
  const handleTextChange = (e) => {
    const inputText = e.target.value;
    if (inputText.length > MAX_CHAR) {
      const truncatedText = inputText.slice(0, MAX_CHAR);
      setPostText(truncatedText);
      setRemainingChars(0);
    } else {
      setPostText(inputText);
      setRemainingChars(MAX_CHAR - inputText.length);
    }
  };

  return (
    <>
      <Button
        position={"fixed"}
        bottom={"10"}
        left={"7"}
        leftIcon={<AiOutlineDingtalk />}
        bg={useColorModeValue("gray.300", "gray.dark")}
        onClick={onOpen}
      >
        Post
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />

        <ModalContent>
          <ModalHeader>Create Post</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <Textarea
                placeholder="Post Your Content"
                onChange={handleTextChange}
                value={postText}
              />
              <Text
                fontSize={"xs"}
                fontWeight={"bold"}
                textAlign={"right"}
                margin={"1"}
                color={"gray.800"}
              >
                {remainingChars}/{MAX_CHAR}
              </Text>

              <Input
                type="file"
                hidden
                ref={imageRef}
                onChange={handleImageChange}
              />
              <MdAddAPhoto
                style={{ marginLeft: "5px", cursor: "pointer" }}
                size={16}
                onClick={() => imageRef.current.click()}
              />
            </FormControl>

            {imgUrl && (
              <Flex mt={5} w={"full"} position={"Relative"}>
                <Image src={imgUrl} alt="Selected Image" />
                <CloseButton
                  onClick={() => setImgUrl("")}
                  bg={"red.500"}
                  position={"absolute"}
                  top={2}
                  right={2}
                />
              </Flex>
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleCreatePost} isLoading={loading}>
              Post
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default CreatePost;
