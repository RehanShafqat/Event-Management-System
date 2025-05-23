"use client";

import { useState, useEffect } from "react";
import LoginNavBar from "./LoginNavBar";
import { Outlet } from "react-router-dom";
import SideBar from "./SideBar";

const LoginLayout = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const checkIfMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setSidebarOpen(!mobile);
    };

    // Initial check
    checkIfMobile();

    // Add event listener for window resize
    window.addEventListener("resize", checkIfMobile);

    // Cleanup
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  return (
    <div className="flex flex-col h-screen">
      <LoginNavBar />
      <div className="flex flex-1 pt-16">
        <div
          className={cn(
            "fixed left-0 top-16 h-[calc(100vh-4rem)] transition-all duration-300 ease-in-out z-40",
            sidebarOpen ? "w-60" : "w-0 md:w-0"
          )}
        >
          <SideBar />
        </div>
        <div
          className={cn(
            "flex-1 p-4 overflow-auto transition-all duration-300 ease-in-out",
            sidebarOpen ? "md:ml-60" : "ml-0"
          )}
        >
          <Outlet />
        </div>
      </div>
    </div>
  );
};

// Utility function for conditional class names
const cn = (...classes) => {
  return classes.filter(Boolean).join(" ");
};

export default LoginLayout;
