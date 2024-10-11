import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  HStack,
  InputRightElement,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
  Link,
  useToast,
  Toast,
} from "@chakra-ui/react";
import { useState } from "react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import authScreenAtom from "../atoms/authAtom";
import { useSetRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";


export default function SignupCard() {
  const [showPassword, setShowPassword] = useState(false);
  const setAuthScreenState = useSetRecoilState(authScreenAtom);
  const setUser = useSetRecoilState(userAtom);
  const [inputs , setInputs] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });

  const toast = useToast();

  const handleSignup = async () => {
    try {
      const res = await fetch("/api/users/signup" , {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(inputs),
      })

      const data = await res.json();
      if (data.error){
        toast({
          title: "Error",
          description: data.error,
          status: "error",
          duration: 3000,
          isClosable: true,
        })
        return;
      }

      localStorage.setItem("user-talk" , JSON.stringify(data)); 
      setUser(data);
    } catch (error) {
      toast({
        title: "Error",
        description: error,
        status: "error",
        duration: 4000,
        isClosable: true,
      })
    }
  }

  return (
    <Flex h={"80vh"} align={"center"} justify={"center"}>
      <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
        <Stack align={"center"}>
          <Heading fontSize={"4xl"} textAlign={"center"}>
            Sign up
          </Heading>
          <Text fontSize={"lg"} color={"gray.600"}>
            to enjoy all of our cool features ✌️
          </Text>
        </Stack>
        <Box rounded={"lg"} boxShadow={"lg"} p={8}>
          <Stack spacing={4}>
            <HStack>
              <Box>
                <FormControl  isRequired>
                  <FormLabel>Full name</FormLabel>
                  <Input onChange={(e) => setInputs({ ...inputs , name : e.target.value})} value={inputs.name} type="text" />
                </FormControl>
              </Box>
              <Box>
                <FormControl isRequired >
                  <FormLabel>Username</FormLabel>
                  <Input  onChange={(e) => setInputs({ ...inputs , username : e.target.value})} value={inputs.username} type="text" />
                </FormControl>
              </Box>
            </HStack>
            <FormControl isRequired>
              <FormLabel>Email address</FormLabel>
              <Input  onChange={(e) => setInputs({ ...inputs , email : e.target.value})} value={inputs.email} type="email" />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Password</FormLabel>
              <InputGroup>
                <Input  onChange={(e) => setInputs({ ...inputs , password : e.target.value})} value={inputs.password} type={showPassword ? "text" : "password"} />
                <InputRightElement h={"full"}>
                  <Button
                    variant={"ghost"}
                    onClick={() =>
                      setShowPassword((showPassword) => !showPassword)
                    }
                  >
                    {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>
            <Stack spacing={10} pt={2}>
              <Button
                loadingText="Submitting"
                size="lg"
                bg={"blue.400"}
                color={"white"}
                _hover={{
                  bg: "blue.500",
                }}
                onClick={handleSignup}
              >
                Sign up
              </Button>
            </Stack>
            <Stack pt={6}>
              <Text align={"center"}>
                Already a user? <Link onClick={() => {setAuthScreenState("login")}} color={"blue.400"}>Login</Link>
              </Text>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
}
