import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  useColorModeValue,
  Avatar,
  AvatarBadge,
  IconButton,
  Center,
  useToast,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import { useRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";
import { useNavigate } from "react-router-dom";

export default function UpdateProfilePage() {
  const [user, setUser] = useRecoilState(userAtom);
  const [imgUrl, setImgUrl] = useState(null);
  const [inputs, setInputs] = useState({
    name: user.name,
    username: user.username,
    email: user.email,
    aboutMe: user.aboutMe,
    password: "",
  });

  const navigate = useNavigate();


  const toast = useToast();

  const fileRef = useRef(null);
  const [updating , setUpdating] = useState(false)
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImgUrl(reader.result);
        // console.log(imgUrl);
      };
      reader.readAsDataURL(file);
      // console.log(imgUrl);
    } else {
        toast({
            title: "Invalid file Type",
            description: "Please select an image file (jpg, png)",
            status: "error",
            duration: 3000,
            isClosable: true,
        })
        setImgUrl(null)
        // console.log(imgUrl);
    };
  };

  const handleSubmit = async (e) => {
    if(updating) return ;
    setUpdating(true);
    e.preventDefault();
    try {
      const res = await fetch(`/api/users/update/${user._id}` , {
        method: "PUT",
        headers: { "Content-Type" : "application/json" },
        body: JSON.stringify({...inputs , profilePic : imgUrl}),
      })

      const data = await res.json();
      setUser(data);
      console.log(data);

    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile",
        status: "error",
        duration: 3000,
        isClosable: true,
      })
    } finally {
      setUpdating(false);
    }

    console.log(inputs);
    // console.log(imgUrl);
  }


  
  return (
    <form onSubmit={handleSubmit}>
    <Flex h={"95vh"} align={"center"} justify={"center"}>
      <Stack
        spacing={4}
        w={"full"}
        maxW={"md"}
        rounded={"xl"}
        boxShadow={"lg"}
        p={6}
        my={12}
      >
        <Heading lineHeight={1.1} fontSize={{ base: "2xl", sm: "3xl" }}>
          User Profile Edit
        </Heading>
        <FormControl id="userName">
          <Stack direction={["column", "row"]} spacing={6}>
            <Center>
              <Avatar size="xl" src={imgUrl || user.profilePic} />
            </Center>
            <Center w="full">
              <Button onClick={() => fileRef.current.click()} w="full">
                Change ProfilePic
              </Button>
              <Input
                type="file"
                onChange={handleImageChange}
                hidden
                ref={fileRef}
              ></Input>
            </Center>
          </Stack>
        </FormControl>
        <FormControl >
          <FormLabel>Full name</FormLabel>
          <Input
            value={inputs.name}
            onChange={(e) => setInputs({ ...inputs, username: e.target.value })}
            placeholder="Fullname"
            _placeholder={{ color: "gray.500" }}
            type="text"
          />
        </FormControl>
        <FormControl >
          <FormLabel>User name</FormLabel>
          <Input
            placeholder="UserName"
            value={inputs.username}
            onChange={(e) => setInputs({ ...inputs, username: e.target.value })}
            _placeholder={{ color: "gray.500" }}
            type="text"
          />
        </FormControl>
        <FormControl >
          <FormLabel>Email address</FormLabel>
          <Input
            value={inputs.email}
            onChange={(e) => setInputs({ ...inputs, email: e.target.value })}
            placeholder="your-email@example.com"
            _placeholder={{ color: "gray.500" }}
            type="email"
          />
        </FormControl>
        <FormControl >
          <FormLabel>About Me</FormLabel>
          <Input
            value={inputs.aboutMe}
            onChange={(e) => setInputs({ ...inputs, aboutMe: e.target.value })}
            placeholder="About me"
            _placeholder={{ color: "gray.500" }}
            type="text"
          />
        </FormControl>
        <FormControl  >
          <FormLabel>Password</FormLabel>
          <Input
            placeholder="password"
            value={inputs.password}
            onChange={(e) => setInputs({ ...inputs, password: e.target.value })}
            _placeholder={{ color: "gray.500" }}
            type="password"
          />
        </FormControl>
        <Stack spacing={6} direction={["column", "row"]}>
          <Button
            bg={"red.400"}
            color={"white"}
            w="full"
            _hover={{
              bg: "red.500",
            }}
          >
            Cancel
          </Button>
          <Button
          type="submit"
            bg={"green.400"}
            color={"white"}
            w="full"
            _hover={{
              bg: "green.600",
            }}
            isLoading={updating}
            // onClick={navigate(`/${user.username}`)}
          >
            Submit
          </Button>
        </Stack>
      </Stack>
    </Flex>
    </form>
  );
}
