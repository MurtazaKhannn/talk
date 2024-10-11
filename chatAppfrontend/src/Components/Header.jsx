import { Flex, Image, useColorMode, useToast } from "@chakra-ui/react";
import LW from "../assets/talk white.jpg";
import LB from "../assets/talk black.jpg";
import React, { useState } from "react";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import { Link, Link as RouterLink } from "react-router-dom";
import { MdHomeMax } from "react-icons/md";
import { FaRegUser } from "react-icons/fa6";
import { SiChatwoot } from "react-icons/si";
import { Input } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const [searchedUser, setSearchedUser] = useState("");
  const user = useRecoilValue(userAtom);
  const toast = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!searchedUser) {
      toast({
        title: "Empty search",
        description: "Please enter a username to search",
        status: "warning",
        position: "top-right",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    navigate(`/${searchedUser}`);
    setSearchedUser("");
  };
  return (
    <Flex direction={"column"} alignItems={"center"}>
      <Flex justifyContent={"space-between"} mt={6} mb={12}>
        {user && (
          <>
            <Flex gap={"4vw"}>
              <Link as={RouterLink} to="/">
                <MdHomeMax size={24} />
              </Link>
              <Link as={RouterLink} to="/chat">
                <SiChatwoot size={20} />
              </Link>
            </Flex>
          </>
        )}


        {user && (
          <form onSubmit={handleSubmit}>
          <Input
            value={searchedUser}
            onChange={(e) => setSearchedUser(e.target.value)}
            placeholder="Search Profile"
            ml={4}
            mr={4}
            mt={-2}
            w={"28vw"}
          />
        </form>
        )}

        

        {user && (
          <Link as={RouterLink} to={`/${user.username}`}>
            <FaRegUser size={18} />
          </Link>
        )}
      </Flex>

      <Image
        cursor="pointer"
        alt="logo"
        w={24}
        src={colorMode === "dark" ? LB : LW}
        onClick={toggleColorMode}
        alignItems={"center"}
        mt={-10}
      />
    </Flex>
  );
};

export default Header;
