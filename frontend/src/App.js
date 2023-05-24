import React, { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Signup from "./pages/Signup";
import Verification from "./pages/Verification";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import Logout from "./pages/Logout";
import Profile from "./pages/Profile";

function App() {
  const[token ,setToken] = useState()

  useEffect(() => {
    const getToken = async () => {
      const token = await localStorage.getItem("token");
      setToken(token);
    };
    getToken()
  }, []);
  
  return (
    <BrowserRouter>
    <Navbar/>
      <Routes>
        { token ? <>
          <Route path="/" element={<Home />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/profile" element={<Profile />} />

        </>:S
        <>
        <Route path="/signup" element={<Signup />} />
        <Route path="/verify" element={<Verification />} />
        <Route path="/login" element={<Login />} />
        </>
         }
        
       
      </Routes>
      <ToastContainer
        position="bottom-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </BrowserRouter>
  );
}

export default App;
