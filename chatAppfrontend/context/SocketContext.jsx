import { createContext, useContext, useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { io } from "socket.io-client"
import userAtom from "../src/atoms/userAtom";

const SocketContext = createContext();

export const useSocket = () => {
    return useContext(SocketContext);
}

export const SocketContextProvider = ({children}) => {
    const [socket, setSocket] = useState(null);
    const user = useRecoilValue(userAtom);
    const [onlineUsers, setOnlineUsers] = useState([]);

    useEffect(() => {
        if (!user?._id) return; // Don't connect if no user

        const socket = io("https://talk-17wq.onrender.com", {
            query: {
                userId: user._id
            },
            withCredentials: true // Enable credentials
        });

        setSocket(socket);

        socket.on("connect", () => {
            console.log("Socket connected");
        });

        socket.on("getOnlineUsers", (users) => {
            if (Array.isArray(users)) {
                setOnlineUsers(users);
            } else {
                setOnlineUsers([]);
            }
        });

        socket.on("connect_error", (error) => {
            console.error("Socket connection error:", error);
        });

        return () => {
            if (socket) {
                socket.disconnect();
            }
        };
    }, [user?._id]);

    return (
        <SocketContext.Provider value={{socket, onlineUsers}}>
            {children}
        </SocketContext.Provider>
    );
}