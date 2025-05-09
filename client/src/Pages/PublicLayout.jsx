import Navbar from "../components/ui/navbar";
import { Outlet } from "react-router-dom";

const PublicLayout = ({ children }) => {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
};

export default PublicLayout;
