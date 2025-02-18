import { createContext, useState, useContext, useEffect } from "react";
import {registerRequest, loginRequest, verifyTokenRequest} from '../services/user'
import Cookies from 'js-cookie'

export const UserContext = createContext()

export const useUser = () => {
    const context = useContext(UserContext)
    if (!context) {
        throw new Error('userUser must be used within a UserProvider')
    }
    return context
}

export const UserProvider = ({children}) => {
    const [user, setUser] = useState(null)
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [errors, setErrors] = useState([])

    const signup = async (user) =>{
        try {
        
            const res = await registerRequest(user)
            console.log(res.data)
            setUser(res.data)
            setIsAuthenticated(true)
    } catch (error) {
        if(Array.isArray(error.response.data)){
            return setErrors(error.response.data)
        }
        setErrors([error.response.data.message])       
    }}; 

    const login = async (user) =>{
        try {
            const res = await loginRequest(user)
            console.log(res.data)
            setUser(res.data)
            setIsAuthenticated(true)
    } catch (error) {
        if(Array.isArray(error.response.data)){
            return setErrors(error.response.data)
        }
        setErrors([error.response.data.message])       
    }}

    const logout = () => {
        Cookies.remove('token')
        setUser(null)
        setIsAuthenticated(false)
    }

    useEffect(() => {
        if(errors.length > 0){
            const timer = setTimeout(() => {
                setErrors([])
            }, 5000)
            return () => clearTimeout(timer)
        }
    }, [errors])

    useEffect(() => {
        async function checkLogin(){
            const cookies = Cookies.get()

            if(!cookies.token){
                setIsAuthenticated(false)
                return setUser(null)
            }
            try {
                const res =  verifyTokenRequest(cookies.token)
                if (!res.data) {
                    setIsAuthenticated(false)
                    return
                }
  
                  setUser(res.data)
                  setIsAuthenticated(true)
              } catch (error) {
                  setIsAuthenticated(false)
                  setUser(null)
              }   
        }
        checkLogin()
    },[])
    return (
        <UserContext.Provider value={{
            signup,
            user,
            isAuthenticated,
            errors,
            login,
            logout,
        }}
        >
            {children}
        </UserContext.Provider>
    )
}