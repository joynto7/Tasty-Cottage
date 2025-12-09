import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Footer from "../Pages/Home/Shared/Footer/Footer";
import NavBar from "../Pages/Home/Shared/NavBar/NavBar";

import Banner from "../Pages/Home/Banner/Banner";
import ChatBot from "../components/ChatBot/ChatBot";

const Main = () => {

  const location = useLocation();
  const noHeaderFooter = location.pathname.includes('login') || location.pathname.includes('signup');


  return (
    <div className="bg-gradient-to-br from-base-100 to-base-200 min-h-screen">
      {noHeaderFooter || <NavBar></NavBar>}
      <Outlet></Outlet>
      {noHeaderFooter || <Footer></Footer>}
      <ChatBot />
    </div>
  );
}
export default Main;