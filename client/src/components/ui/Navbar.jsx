import React from "react";

import { Button } from "@/components/ui/button";
import { Aperture, Home, Info, Mail, User, BrainCircuit } from "lucide-react";
import { Link } from "react-router-dom";

const Navbar = () => {
  console.log("hello");
  return (
    <nav className="bg-[#1a1a1a] border-b border-[#2a2a2a] px-4 py-3 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <Link to="/" className="flex items-center space-x-2 cursor-pointer">
            <Aperture className="h-8 w-8 text-[#7f3fbf]" />
            <span className="text-xl font-bold text-white">Softec</span>
            {/* <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTQQ8qJIRCD5sUkHUfoBuh_BLTfeIBp9Nt7zA&s"
              alt="Softec"
              className="h-15 w-15"
            /> */}
          </Link>

          <div className="hidden md:flex space-x-6">
            <Link to={"/competitions"}>
              <Button
                variant="ghost"
                className="text-gray-300 hover:text-white hover:bg-[#2a2a2a] cursor-pointer"
              >
                <BrainCircuit mr-2 h-4 w-4 />
                Competitions
              </Button>
            </Link>

            <Link to={"/about"}>
              <Button
                variant="ghost"
                className="text-gray-300 hover:text-white hover:bg-[#2a2a2a] cursor-pointer"
              >
                <Info className="mr-2 h-4 w-4" /> About
              </Button>
            </Link>

            <Link to={"/contact"}>
              <Button
                variant="ghost"
                className="text-gray-300 hover:text-white hover:bg-[#2a2a2a] cursor-pointer"
              >
                <Mail className="mr-2 h-4 w-4" /> Contact
              </Button>
            </Link>
          </div>
        </div>

        <Link to="/login">
          <Button className="bg-[#e50914] hover:bg-[#f12a34] text-white cursor-pointer">
            <User className="mr-2 h-4 w-4" /> Login
          </Button>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
