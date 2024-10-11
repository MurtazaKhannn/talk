import { Button, Flex, Text, useToast } from '@chakra-ui/react'
import React from 'react'
import { useSetRecoilState } from 'recoil'
import userAtom from '../atoms/userAtom';
import { FiLogOut } from "react-icons/fi";
import { useNavigate } from 'react-router-dom';


const LogoutButton = () => {
    const toast = useToast();
    const setUser = useSetRecoilState(userAtom);
    const navigate = useNavigate();



    const handleLogout = async () => {

        try {
            const res = await fetch("/api/users/logout" , {
                method: "POST",
                headers: { "Content-Type": "application/json" },
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
            }
            localStorage.removeItem("user-talk");
            setUser(null);
            navigate('/auth');


            
        } catch (error) {
            console.log(error);
        }
    }
  return (
    <Button
    position={"fixed"}
    top={"30px"}
    right={"30px"}
    size={"md"}
    onClick={handleLogout}
    >
        <Flex alignItems={"center"} gap={2}>
        <Text>Logout</Text> 
        <FiLogOut />
        </Flex>
      
    </Button>
  )
}

export default LogoutButton
