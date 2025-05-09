import Navbar from "./components/ui/navbar";
import ApplicationForm from "./Pages/ApplicationForm";
import Competitions from "./Pages/Competitions";
import HomePage from "./Pages/HomePage";
import Login from "./Pages/Login";
import About from "./Pages/About";
import Contact from "./Pages/Contact";
import Dashboard from "./Pages/Dashboard";
import ProtectedRoute from "./Pages/ProtectedRoute";
import { Route, Routes } from "react-router-dom";
import PublicLayout from "./Pages/PublicLayout";





function App() {
  return (
    <>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route exact path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/competitions" element={<Competitions />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Route>
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        {/* <Route path="/competitions/register" element={<ApplicationForm />} /> */}
      </Routes>
    </>
  );
}

export default App;
