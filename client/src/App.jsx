import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
// import "./App.css";
import SignUp from "./Pages/SignUp";
import Navbar from "./components/Navbar";
import DeputyHead from "./Pages/Schedule/DeputyHead";
import Head from "./Pages/Schedule/Head";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
    <Navbar/>
    <Head/>
    </>
  );
}

export default App;
