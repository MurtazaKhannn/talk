import React, { useState } from 'react'
import SignupCard from '../Components/signUpCard'
import LoginCard from '../Components/LoginCard'
import { useRecoilValue } from 'recoil'
import authScreenAtom from '../atoms/authAtom'
const AuthPage = () => {

    const authScreenState = useRecoilValue(authScreenAtom);

    console.log(authScreenAtom);
  
  return (
    <>
    {authScreenState === "login" ? <LoginCard />  : <SignupCard />}
        
    </>
  )
}

export default AuthPage
