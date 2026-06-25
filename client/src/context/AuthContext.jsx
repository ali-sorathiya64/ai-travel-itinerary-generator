import { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axios";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);


export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);



  const fetchMe = async () => {

    try {

      const token = localStorage.getItem("accessToken");


      if (!token) {
        setLoading(false);
        return;
      }


      const { data } = await api.get("/auth/get-me", {
        headers:{
          Authorization:`Bearer ${token}`
        }
      });


      setUser(data.user);


    } catch(error){

      setUser(null);
      localStorage.removeItem("accessToken");


    } finally {

      setLoading(false);

    }

  };



  useEffect(() => {

    fetchMe();

  }, []);





  const login = async (email,password)=>{


    const {data} = await api.post("/auth/login",{
      email,
      password
    });



    localStorage.setItem(
      "accessToken",
      data.accessToken
    );


    setUser(data.user);


    return data;

  };





  const register = async (
    userName,
    email,
    password
  )=>{


    const {data}=await api.post(
      "/auth/register",
      {
        userName,
        email,
        password
      }
    );


    return data;

  };






  const verifyEmail = async (
    email,
    otp
  )=>{


    const {data}=await api.post(
      "/auth/verify-email",
      {
        email,
        otp
      }
    );


    return data;

  };







  const logout = async()=>{


    try{

      await api.post("/auth/logout");


    }catch(error){

    }


    localStorage.removeItem(
      "accessToken"
    );


    setUser(null);


  };





  return (

    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        verifyEmail,
        logout
      }}
    >

      {children}

    </AuthContext.Provider>

  );

};