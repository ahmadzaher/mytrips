import React, { useState, useContext } from "react";

export const AuthContext = React.createContext(null);

import axios from 'axios'

export const UserContext = props => {

  const [isLoggedIn, setLoginSuccess] = useState(false);

  const [isLoginPending,setLoginPending ] = useState(false);

  const [loginError, setLoginError] = useState(null);

  const [token, setToken] = useState(null);

  const [isReady, setIsReady] = useState(false)

  const [email, setEmail] = useState('')

  const [phoneNumber, setPhoneNumber] = useState('')

  const [name, setName] = useState('')

  const login = (email, password) =>
  {
    setLoginPending(true);
    setLoginSuccess(false)
    setLoginError(null)
    setIsReady(false)


    axios.post('api/auth/login', {
        email,
        password
    })
    .then(res => {
        if (res.data !== undefined){
            setToken(res.data.data.token)
            setLoginSuccess(true);
            setName(res.data.data.user.name)
            setEmail(res.data.data.user.email)
            setPhoneNumber(res.data.data.user.phone_number)
        }
    })
    .catch(e => console.log(e))
    .then(() => {
        window.location.reload()
    })
  }

  const logout = () =>
  {
      setIsReady(false)
      axios.post('api/auth/logout')
          .catch((e) => console.log(e))
          .then(() => {
              window.location.reload()
          })
      setToken(null)
      setLoginSuccess(false);
      setName(null)
      setEmail(null)
      setPhoneNumber(null)
  }

  React.useEffect(() => {
      setIsReady(false)
      axios.get('api/profile')
      .then((res) => {
          if(res.status === 200)
          {
            setLoginSuccess(true);
            setName(res.data.data.name)
            setEmail(res.data.data.email)
            setPhoneNumber(res.data.data.phone_number)
            setIsReady(true)
          }
      })
          .catch((e) => {
              setIsReady(true)
          })
  }, [])

  return (
      <AuthContext.Provider
        value={{
            isLoggedIn,
            isLoginPending,
            loginError,
            token,
            isReady,
            setIsReady,
            email,
            phoneNumber,
            name,
            login,
            logout
        }}
      >
          {props.children}
      </AuthContext.Provider>
  )
}

