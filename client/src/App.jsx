import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
// import "./App.css";
import SignUp from "./Pages/SignUp";
import Navbar from "./components/Navbar";
import DeputyHead from "./Pages/Schedule/DeputyHead_S";
import Head from "./Pages/Schedule/Head_S";
import AVP from "./Pages/Schedule/AVP_S";
import DeputyHeads from "./Pages/Tasks_Assignment/DeputyHead_A";
import AVP_S from "./Pages/Schedule/AVP_S";
import Head_S from "./Pages/Schedule/Head_S";
import DeputyHead_S from "./Pages/Schedule/DeputyHead_S";
import Head_A from "./Pages/Tasks_Assignment/Head_A";
import AVP_A from "./Pages/Tasks_Assignment/AVP_A";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
    <Navbar/>
    <AVP_A/>
    </>
  );
}

export default App;
