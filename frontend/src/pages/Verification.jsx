import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import queryString from "query-string";
import axios from "axios"
import Loader from "../components/Loader";

const Verification = () => {
  const location = useLocation()
    const [data ,setData] = useState(false)
    const [loading, setLoding] = useState(false);
    const { token } = queryString.parse(location.search);

    const verifyToken = async () => {
      try {
        setLoding(true)
        const { data } = await axios.post(
          `http://192.168.112.17:4000/api/verify?token=${token}`
        );
       setData(data)
       setLoding(false)
      } catch (error) {
        console.log(error)
      }
    };
  
    useEffect(() => {
      verifyToken();
    }, []);

  return (
    loading?<div className="flex items-center justify-center h-screen"><Loader/></div>
    :
      <div className="flex items-center justify-center h-screen">
        <div>
          <div className="flex flex-col items-center space-y-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={data.success===true? "text-green-600 w-28 h-28":"text-red-600 w-28 h-28"}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="1"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h1 className="text-4xl font-bold">{data.success?"excellent": "Oooop!"}</h1>
            <p>{data.message}</p>
            <Link
              to="/"
              className="inline-flex items-center px-4 py-2 text-white bg-indigo-600 border border-indigo-600  rounded-full hover:bg-indigo-700 focus:outline-none focus:ring"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-3 h-3 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M7 16l-4-4m0 0l4-4m-4 4h18"
                />
              </svg>
              <span className="text-sm font-medium">Home</span>
            </Link>
          </div>
        </div>
      </div>
    
  );
};

export default Verification;
