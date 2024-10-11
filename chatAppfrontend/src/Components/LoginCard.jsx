import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Checkbox,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import authScreenAtom from "../atoms/authAtom";
import { useSetRecoilState } from "recoil";
import { useState } from "react";
import userAtom from "../atoms/userAtom";

export default function LoginCard() {
  const [inputs, setInputs] = useState({
    username: "",
    password: "",
  });
  const toast = useToast();
  const setUser = useSetRecoilState(userAtom);
  const [loading , setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: inputs.username, // Consistent key names
          password: inputs.password,
        }),
      });

      const data = await res.json();
      if (data.error) {
        toast({
          title: "Login failed",
          description: "Invalid credentials",
          status: "error",
          duration: 2000,
          isClosable: true,
        });
        return;
      }

      localStorage.setItem("user-talk", JSON.stringify(data));
      setUser(data);
    } catch (error) {
      toast({
        title: "Login failed",
        description: error.message,
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const setAuthScreenState = useSetRecoilState(authScreenAtom);

  return (
    <Flex minW={"full"} h={"80vh"} align={"center"} justify={"center"}>
      <Stack spacing={8} mx={"auto"} minW={"full"} py={12} px={6}>
        <Stack align={"center"}>
          <Heading fontSize={"4xl"}>Login</Heading>
          <Text fontSize={"lg"} color={"gray.600"}>
            to enjoy all of our cool <Text color={"blue.400"}>features</Text> ✌️
          </Text>
        </Stack>
        <Box rounded={"lg"} boxShadow={"lg"} p={8}>
          <Stack spacing={4}>
            <FormControl id="username">
              <FormLabel>Username</FormLabel>
              <Input
                isRequired
                value={inputs.username}
                onChange={(e) =>
                  setInputs((inputs) => ({
                    ...inputs,
                    username: e.target.value,
                  }))
                }
                type="text"
              />
            </FormControl>
            <FormControl id="password">
              <FormLabel>Password</FormLabel>
              <Input
                isRequired
                value={inputs.password}
                onChange={(e) =>
                  setInputs((inputs) => ({
                    ...inputs,
                    password: e.target.value,
                  }))
                }
                type="password"
              />
            </FormControl>
            <Stack spacing={10}>
              <Stack
                direction={{ base: "column", sm: "row" }}
                align={"start"}
                justify={"space-between"}
              >
                {/* <Checkbox>Remember me</Checkbox> */}
                <Text color={"blue.400"}>Forgot password?</Text>
              </Stack>
              <Flex gap={3}>
                new?{" "}
                <Text
                  onClick={() => {
                    setAuthScreenState("signUp");
                  }}
                  _hover={{ textDecoration: "underline" }}
                  cursor={"pointer"}
                  color={"blue.400"}
                >
                  Create an account
                </Text>
              </Flex>
              <Button
                bg={"blue.400"}
                color={"white"}
                _hover={{
                  bg: "blue.500",
                }}
                onClick={handleLogin}
                isLoading={loading}
              >
                Login
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
}
