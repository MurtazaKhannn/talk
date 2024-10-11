import React from 'react'
import { Box, Container } from '@chakra-ui/react'
import { Navigate, Route, Routes } from 'react-router-dom'
import PostPage from './pages/PostPage'
import UserPage from './pages/UserPage'
import Header from './Components/Header'
import UserPost from './Components/UserPost'
import HomePage from './pages/HomePage'
import AuthPage from './pages/AuthPage'
import userAtom from './atoms/userAtom'
import { useRecoilValue } from "recoil";
import LogoutButton from './Components/LogoutButton'
import UpdateProfilePage from './pages/UpdateProfilePage'
import CreatePost from './Components/CreatePost'
import ChatPage from './pages/ChatPage'


const App = () => {

  const user = useRecoilValue(userAtom);


  return (
    <Box position={"Relative"} w={"full"}>
    <Container maxW="620px">
      <Header />
      <Routes>
        <Route path='/' element={user ? <HomePage /> : <Navigate to="/auth" />}   />
        <Route path='/auth' element={!user ? <AuthPage /> : <Navigate to="/" />} />
        <Route path='/update/:id' element={user ? <UpdateProfilePage /> : <Navigate to="/auth" />} />


        <Route path="/:username" element={<UserPage />} />
        <Route path="/:username/post/:pid" element={<PostPage />} />
        <Route path="/chat" element={user ? <ChatPage /> : <Navigate to={"/auth"} />} />
      </Routes>

      {user && <LogoutButton /> }
      {user && <CreatePost /> }
    </Container>
    </Box>
  )
}

export default App
