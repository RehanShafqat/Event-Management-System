"use client";
import { Link } from "react-router-dom";
import React from "react";

import {
  LayoutDashboard,
  Trophy,
  Users,
  UserCircle,
  ChevronDown,
  Menu,
  X,
  Calendar,
  ListChecks,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { ROLES } from "../../utils/roles";
import { cn } from "@/lib/utils";

const SideBar = () => {
  const { user } = useSelector((state) => state.authentication);
  const canAccessCompetitions =
    user?.role && [ROLES.PRESIDENT].includes(user.role);
  const canAccessRecruitment =
    user?.role &&
    [ROLES.PRESIDENT, ROLES.VP, ROLES.AVP, ROLES.HEAD, ROLES.DEPUTY].includes(
      user.role
    );

  const [isOpen, setIsOpen] = useState(true); // Default to open on desktop
  const [isMobile, setIsMobile] = useState(false);

  // Check if we're on mobile based on screen width
  useEffect(() => {
    const checkIfMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      // Only auto-close on initial load if mobile
      if (mobile && isOpen === true) {
        setIsOpen(false);
      } else if (!mobile && isOpen === false) {
        setIsOpen(true);
      }
    };

    checkIfMobile();

    window.addEventListener("resize", checkIfMobile);

    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Mobile Toggle Button - Always visible on mobile */}
      <Button
        variant="outline"
        size="icon"
        className={cn(
          "fixed z-[60] md:hidden bg-white text-black",
          isOpen ? "left-[240px] top-[4.5rem]" : "left-4 top-[4.5rem]"
        )}
        onClick={toggleSidebar}
        aria-label={isOpen ? "Close menu" : "Open menu"}
      >
        {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
      </Button>

      {/* Overlay for mobile when sidebar is open - positioned BEHIND the sidebar */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-[45] md:hidden mt-16"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar - higher z-index than overlay */}
      <div
        className={cn(
          "h-full w-60 text-white p-4 border-r border-gray bg-[#020618] transition-all duration-300 ease-in-out z-[50]",
          isMobile && !isOpen && "-translate-x-full w-60",
          isMobile && isOpen && "translate-x-0 w-60",
          !isMobile && "translate-x-0"
        )}
      >
        {/* Common navigation items for all roles */}
        <nav className="space-y-1 overflow-y-auto max-h-full relative z-[51]">
          <Link to="/dashboard" onClick={isMobile ? toggleSidebar : undefined}>
            <Button variant="ghost" className="w-full justify-start text-white">
              <LayoutDashboard className="mr-2 h-4 w-4" />
              Dashboard
            </Button>
          </Link>

          {/* Competitions Section - Only accessible by President and VP */}
          {canAccessCompetitions && (
            <CollapsibleNavGroup
              title="Competitions"
              icon={<Trophy className="mr-2 h-4 w-4" />}
              onItemClick={isMobile ? toggleSidebar : undefined}
            >
              <Link
                to={"/crud/competitions"}
                onClick={isMobile ? toggleSidebar : undefined}
              >
                <Button variant="ghost" className="w-full justify-start pl-8">
                  Manage Competitions
                </Button>
              </Link>
            </CollapsibleNavGroup>
          )}

          {/* Recruitment Section - Accessible by President, VP, AVP, and Head */}
          {canAccessRecruitment && (
            <CollapsibleNavGroup
              title="Recruitment"
              icon={<Users className="mr-2 h-4 w-4" />}
              onItemClick={isMobile ? toggleSidebar : undefined}
            >
              {user.role === ROLES.PRESIDENT && (
                <>
                  <Link
                    to="/recruitment/applications"
                    onClick={isMobile ? toggleSidebar : undefined}
                  >
                    <Button
                      variant="ghost"
                      className="w-full justify-start pl-8"
                    >
                      Review Applications
                    </Button>
                  </Link>
                </>
              )}
              {user.role === ROLES.VP && (
                <>
                  <Link
                    to="/recruitment/applications"
                    onClick={isMobile ? toggleSidebar : undefined}
                  >
                    <Button
                      variant="ghost"
                      className="w-full justify-start pl-8"
                    >
                      Review AVP/Head Applications
                    </Button>
                  </Link>
                  <Link
                    to="/recruitment/apply"
                    onClick={isMobile ? toggleSidebar : undefined}
                  >
                    <Button
                      variant="ghost"
                      className="w-full justify-start pl-8"
                    >
                      Initiate Recruitment Drives
                    </Button>
                  </Link>
                </>
              )}
              {user.role === ROLES.AVP && (
                <Link
                  to="/recruitment/applications"
                  onClick={isMobile ? toggleSidebar : undefined}
                >
                  <Button variant="ghost" className="w-full justify-start pl-8">
                    Review Head Applications
                  </Button>
                </Link>
              )}
              {user.role === ROLES.HEAD && (
                <Link
                  to="/recruitment/applications"
                  onClick={isMobile ? toggleSidebar : undefined}
                >
                  <Button variant="ghost" className="w-full justify-start pl-8">
                    Nominate Deputies
                  </Button>
                </Link>
              )}
              {user.role === ROLES.DEPUTY && (
                <Link
                  to="/recruitment/applications"
                  onClick={isMobile ? toggleSidebar : undefined}
                >
                  <Button variant="ghost" className="w-full justify-start pl-8">
                    Nominate Officers
                  </Button>
                </Link>
              )}
            </CollapsibleNavGroup>
          )}

          {/* Meetings Section - Accessible by all roles */}
          <CollapsibleNavGroup
            title="Meetings"
            icon={<Calendar className="mr-2 h-4 w-4" />}
            onItemClick={isMobile ? toggleSidebar : undefined}
          >
            <Link to="/meetings" onClick={isMobile ? toggleSidebar : undefined}>
              <Button variant="ghost" className="w-full justify-start pl-8">
                {user.role === ROLES.PRESIDENT && "Schedule Meeting"}
                {user.role === ROLES.VP && "Schedule with AVPs/Heads"}
                {user.role === ROLES.AVP && "Schedule with Heads/Deputies"}
                {user.role === ROLES.HEAD && "Attend/Report to AVP"}
                {user.role === ROLES.DEPUTY && "Attend/Report to Head"}
                {user.role === ROLES.OFFICER && "View Meetings"}
              </Button>
            </Link>
          </CollapsibleNavGroup>

          {/* Tasks Section - Accessible by all roles */}
          <CollapsibleNavGroup
            title="Tasks"
            icon={<ListChecks className="mr-2 h-4 w-4" />}
            onItemClick={isMobile ? toggleSidebar : undefined}
          >
            <Link to="/tasks" onClick={isMobile ? toggleSidebar : undefined}>
              <Button variant="ghost" className="w-full justify-start pl-8">
                {user.role === ROLES.PRESIDENT && "Manage Tasks"}
                {user.role === ROLES.VP && "Assign to AVPs"}
                {user.role === ROLES.AVP && "Assign to Heads"}
                {user.role === ROLES.HEAD && "Assign to Deputies"}
                {user.role === ROLES.DEPUTY && "Assign to Officers"}
                {user.role === ROLES.OFFICER && "View Tasks"}
              </Button>
            </Link>
          </CollapsibleNavGroup>

          {/* Profile - Accessible by all roles */}
          <Link to="/profile" onClick={isMobile ? toggleSidebar : undefined}>
            <Button variant="ghost" className="w-full justify-start">
              <UserCircle className="mr-2 h-4 w-4" />
              Profile
            </Button>
          </Link>
        </nav>
      </div>
    </>
  );
};

function CollapsibleNavGroup({ title, icon, children, onItemClick }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleGroup = (e) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  // Properly pass the onItemClick to children
  const childrenWithProps = React.Children.map(children, (child) => {
    if (React.isValidElement(child) && onItemClick) {
      // Clone the child element to add the onClick handler
      return React.cloneElement(child, {
        onClick: (e) => {
          // Call the original onClick if it exists
          if (child.props.onClick) {
            child.props.onClick(e);
          }
          // Call the onItemClick from props
          onItemClick(e);
        },
      });
    }
    return child;
  });

  return (
    <div className="space-y-1">
      <Button
        variant="ghost"
        className="w-full justify-start"
        onClick={toggleGroup}
        aria-expanded={isOpen}
      >
        {icon}
        {title}
        <ChevronDown
          className={`ml-auto h-4 w-4 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </Button>
      <div
        className={`ml-4 space-y-1 overflow-hidden transition-all duration-200 ${
          isOpen ? "max-h-96" : "max-h-0"
        }`}
      >
        {childrenWithProps}
      </div>
    </div>
  );
}

export default SideBar;
