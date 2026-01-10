// import React, { useContext, useEffect } from 'react'
// import { AppContext } from '../context/AppContext'
// import { useNavigate } from 'react-router-dom';
// import AxiosConfig from '../util/AxiosConfig';
// import { API_ENDPOINTS } from '../util/apiEndPoints';

// const useUser = () => {

//     const {user, setUser, clearUser, loading} = useContext(AppContext);
//     const navigate = useNavigate();

//     useEffect(()=>{
//         if(user){
//             return;
//         }
//         let isMounted = true;

//         const fetchUserInfo = async ()=>{
//             try {
//                 const response = await AxiosConfig.get(API_ENDPOINTS.GET_USER_INFO);
//                 if(isMounted && response.data){
//                     setUser(response.data);
//                 }
//             } catch (error) {
//                 console.log("failed ot fetch the user info", error);
//                 if(isMounted){
//                     clearUser();
//                     navigate("/login");
//                 }
//             }
//         }
//         fetchUserInfo();
//         return ()=>{
//             user,
//             isAuthReady= !loading,
//             isMounted = false;
//         }
//     },[setUser, clearUser, navigate])
//     return (
//         <div>useUser</div>
//     )
// }

// export default useUser


import { useContext, useEffect } from "react";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import AxiosConfig from "../util/AxiosConfig";
import { API_ENDPOINTS } from "../util/apiEndPoints";

const useUser = () => {
  const { user, setUser, clearUser, loading } = useContext(AppContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) return;

    let isMounted = true;

    const fetchUserInfo = async () => {
      try {
        const response = await AxiosConfig.get(API_ENDPOINTS.GET_USER_INFO);
        if (isMounted && response.data) {
          setUser(response.data);
        }
      } catch (error) {
        if (isMounted) {
          clearUser();
          navigate("/login");
        }
      }
    };

    fetchUserInfo();

    return () => {
      isMounted = false;
    };
  }, [user, setUser, clearUser, navigate]);

  // ✅ THIS IS WHERE isAuthReady COMES FROM
  return {
    user,
    isAuthReady: !loading,
  };
};

export default useUser;
