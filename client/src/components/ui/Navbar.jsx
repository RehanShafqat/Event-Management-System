import React from "react";
import { Button } from "@/components/ui/button";
import { Aperture, Home, Info, Mail, User, BrainCircuit, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { ModeToggle } from "@/components/MyComponents/ModeToggle";
import { useSelector } from "react-redux";
import { ROLES } from "@/utils/roles";

const Navbar = () => {
  const { user } = useSelector((state) => state.authentication);
  const canAccessRecruitment = user?.role && [ROLES.PRESIDENT, ROLES.VP, ROLES.AVP, ROLES.HEAD, ROLES.DEPUTY].includes(user.role);

  return (
    <nav className="border-b bg-background px-4 py-3 sticky top-0">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <Link to="/" className="flex items-center space-x-2 cursor-pointer">
            <Aperture className="h-8 w-8 text-my-purple" />
            <span className="text-xl font-bold">Softec</span>
            {/* <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTQQ8qJIRCD5sUkHUfoBuh_BLTfeIBp9Nt7zA&s"
              alt="Softec"
              className="h-15 w-15"
            /> */}
          </Link>

          <div className="hidden md:flex space-x-6">
            <Link to={"/public/competitions"}>
              <Button variant="ghost">
                <BrainCircuit mr-2 h-4 w-4 />
                Competitions
              </Button>
            </Link>

            <Link to={"/recruitment/apply"}>
              <Button variant="ghost">
                <Users className="mr-2 h-4 w-4" />
                Join Us
              </Button>
            </Link>

            {canAccessRecruitment && (
              <Link to={"/recruitment/applications"}>
                <Button variant="ghost">
                  <Users className="mr-2 h-4 w-4" />
                  Applications
                </Button>
              </Link>
            )}

            <Link to={"/about"}>
              <Button variant="ghost">
                <Button variant="ghost">
                  <Info className="mr-2 h-4 w-4" /> About
                </Button>
            </Link>

            <Link to={"/contact"}>
              <Button variant="ghost">
                <Button variant="ghost">
                  <Mail className="mr-2 h-4 w-4" /> Contact
                </Button>
            </Link>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <ModeToggle />
          <Link to="/login">
            <Button className="bg-[#e50914] hover:bg-[#f12a34] text-white cursor-pointer">
              <User className="mr-2 h-4 w-4" /> Login
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

