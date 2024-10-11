import { useToast } from '@chakra-ui/react';
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';

const userGetProfile = () => {
    const [user , setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const { username } = useParams();
    const toast = useToast();

    useEffect(() => {
        const getUser = async () => {
            try {
                const res = await fetch(`/api/users/profile/${username}`);
                const data = await res.json();
                if(data.error){
                    toast({
                        title: "Error",
                        description: data.error,
                        status: "error",
                        duration: 3000,
                        isClosable: true,
                    })
                    return ;
                }
                setUser(data);
            } catch (error) {
                console.error(error);
                setLoading(false);
            } finally {
                setLoading(false);
            }
        }


        getUser();
    } , [username]);

    return {loading , user}
}

export default userGetProfile
