import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import ActiveInterestedHart from "./components/Icons/ActiveInterestedHart";
import UnactiveInterestedHart from "./components/Icons/UnactiveInterestedHart";
import Card from "./components/UI/Card.jsx";
import image from "/public/images/2025-09-10(1).png";
import NavigationBar from "./components/Layout/NavigationBar.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import SignUpPage from "./pages/SignUpPage.jsx";
import { HeadProvider } from "react-head";

import OTPVerificationPage from "./pages/OTPVerificationPage.jsx";
import ForgetPassword from "./pages/ForgetPassword.jsx";
// import './App.css'

function App() {
  return (
    <>
      <ForgetPassword />
    </>
  );
}

export default App;
