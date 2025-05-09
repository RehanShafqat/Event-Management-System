import Navbar from "./components/ui/navbar";
import ApplicationForm from "./Pages/ApplicationForm";
import Competitions from "./Pages/Competitions";
import HomePage from "./Pages/HomePage";
import Login from "./Pages/Login";
import About from "./Pages/About";
import Contact from "./Pages/Contact";
import { Route, Routes } from "react-router-dom";

function App() {
  return (
    <>
      <Navbar />
      {/* <Login /> */}
      {/* <HomePage /> */}
      <Routes>
        <Route exact path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/competitions" element={<Competitions />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        {/* <Route path="/competitions/register" element={<ApplicationForm />} /> */}
      </Routes>
    </>
  );
}

export default App;
