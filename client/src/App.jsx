import Navbar from "./components/ui/navbar";
import ApplicationForm from "./Pages/ApplicationForm";
import Competitions from "./Pages/PublicCompetitions";
import HomePage from "./Pages/HomePage";
import Login from "./Pages/Login";
import About from "./Pages/About";
import Contact from "./Pages/Contact";
import Dashboard from "./Pages/Dashboard";
import ProtectedRoute from "./Pages/ProtectedRoute";
import { Route, Routes } from "react-router-dom";
import PublicLayout from "./Pages/PublicLayout";
import MFASetup from "./Pages/MFASetup";
import ProfilePage from "./Pages/Profile";
import { ROLES } from "./utils/roles";
import CompetitionsPage from "@/Pages/Competitions";
import CompetitionDetail from "@/Pages/CompetitionDetail";
import CompetitionDetails from "@/Pages/CompetitionDetails";
import PublicCompetitionDetail from "@/Pages/PublicCompetitionDetail";
import LoginNavBar from "./components/ui/LoginNavBar";
import LoginLayout from "./components/ui/LoginLayout";

function App() {
  return (
    <>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route exact path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/setup-mfa" element={<MFASetup />} />
          <Route
            path="/public/competitions/:id"
            element={<PublicCompetitionDetail />}
          />
          <Route path="/public/competitions" element={<Competitions />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Route>

        <Route element={<LoginLayout />}>
          <Route
            path="/profile"
            element={
              <ProtectedRoute
                requiredRole={[
                  ROLES.PRESIDENT,
                  ROLES.VP,
                  ROLES.AVP,
                  ROLES.HEAD,
                  ROLES.DEPUTY,
                  ROLES.OFFICER,
                ]}
              >
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/competitions/:id"
            element={
              <ProtectedRoute
                requiredRole={[ROLES.PRESIDENT, ROLES.VP, ROLES.AVP]}
              >
                <CompetitionDetails />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute requiredRole={[ROLES.PRESIDENT, ROLES.VP]}>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/crud/competitions"
            element={
              <ProtectedRoute requiredRole={[ROLES.PRESIDENT, ROLES.VP]}>
                <CompetitionsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/crud/competitions/:id"
            element={
              <ProtectedRoute requiredRole={[ROLES.PRESIDENT, ROLES.VP]}>
                <CompetitionDetail />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </>
  );
}

export default App;
