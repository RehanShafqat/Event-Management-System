import { Link } from "react-router-dom";
import {
  LayoutDashboard,
  Trophy,
  Users,
  UserCircle,
  ChevronDown,
  Network,
  Calendar,
  ListChecks,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useSelector } from "react-redux";
import { ROLES } from "../../utils/roles";

const SideBar = () => {
  const { user } = useSelector((state) => state.authentication);
  return (
    <div className="fixed left-0 w-60 text-white p-4 border-r border-gray-800 bg-[#020618] min-h-screen">
      {user.role == ROLES.PRESIDENT && (
        <nav className="space-y-1">
          <Link to="/dashboard">
            <Button
              variant="ghost"
              className="w-full justify-start hover:bg-gray-700 text-white"
            >
              <LayoutDashboard className="mr-2 h-4 w-4" />
              Dashboard
            </Button>
          </Link>

          <CollapsibleNavGroup
            title="Competitions"
            icon={<Trophy className="mr-2 h-4 w-4" />}
          >
            <Link to={"/crud/competitions"}>
              <Button
                variant="ghost"
                className="w-full justify-start pl-8 hover:bg-gray-800"
              >
                Manage Competitions
              </Button>
            </Link>
            <Button
              variant="ghost"
              className="w-full justify-start pl-8 hover:bg-gray-800"
            >
              Live Results
            </Button>
          </CollapsibleNavGroup>

          <CollapsibleNavGroup
            title="Recruitment"
            icon={<Users className="mr-2 h-4 w-4" />}
          >
            <Button
              variant="ghost"
              className="w-full justify-start pl-8 hover:bg-gray-800"
            >
              Review Applications
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start pl-8 hover:bg-gray-800"
            >
              Initiate Recruitment Drives
            </Button>
          </CollapsibleNavGroup>

          <CollapsibleNavGroup
            title="Meetings"
            icon={<Calendar className="mr-2 h-4 w-4" />}
          >
            <Button
              variant="ghost"
              className="w-full justify-start pl-8 hover:bg-gray-800"
            >
              Schedule Meeting
            </Button>
          </CollapsibleNavGroup>

          <CollapsibleNavGroup
            title="Tasks"
            icon={<ListChecks className="mr-2 h-4 w-4" />}
          >
            <Link to="/tasks">
              <Button
                variant="ghost"
                className="w-full justify-start pl-8 hover:bg-gray-800"
              >
                Manage Tasks
              </Button>
            </Link>
          </CollapsibleNavGroup>

          <Button
            variant="ghost"
            className="w-full justify-start hover:bg-gray-800"
          >
            <UserCircle className="mr-2 h-4 w-4" />
            Profile
          </Button>
        </nav>
      )}

      {user.role == ROLES.VP && (
        <nav className="space-y-1">
          <Link to="/dashboard">
            <Button
              variant="ghost"
              className="w-full justify-start hover:bg-gray-700 text-white"
            >
              <LayoutDashboard className="mr-2 h-4 w-4" />
              Dashboard
            </Button>
          </Link>

          <CollapsibleNavGroup
            title="Competitions"
            icon={<Trophy className="mr-2 h-4 w-4" />}
          >
            <Link to={"/crud/competitions"}>
              <Button
                variant="ghost"
                className="w-full justify-start pl-8 hover:bg-gray-800"
              >
                Approve Competition Rules
              </Button>
            </Link>
            <Button
              variant="ghost"
              className="w-full justify-start pl-8 hover:bg-gray-800"
            >
              Monitor Live Results
            </Button>
          </CollapsibleNavGroup>

          <CollapsibleNavGroup
            title="Recruitment"
            icon={<Users className="mr-2 h-4 w-4" />}
          >
            <Button
              variant="ghost"
              className="w-full justify-start pl-8 hover:bg-gray-800"
            >
              Review AVP/Head Applications
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start pl-8 hover:bg-gray-800"
            >
              Initiate Recruitment Drives
            </Button>
          </CollapsibleNavGroup>

          <CollapsibleNavGroup
            title="Meetings"
            icon={<Calendar className="mr-2 h-4 w-4" />}
          >
            <Button
              variant="ghost"
              className="w-full justify-start pl-8 hover:bg-gray-800"
            >
              Schedule with AVPs/Heads
            </Button>
          </CollapsibleNavGroup>

          <CollapsibleNavGroup
            title="Tasks"
            icon={<ListChecks className="mr-2 h-4 w-4" />}
          >
            <Link to="/tasks">
              <Button
                variant="ghost"
                className="w-full justify-start pl-8 hover:bg-gray-800"
              >
                Assign to AVPs
              </Button>
            </Link>
          </CollapsibleNavGroup>

          <Button
            variant="ghost"
            className="w-full justify-start hover:bg-gray-800"
          >
            <UserCircle className="mr-2 h-4 w-4" />
            Profile
          </Button>
        </nav>
      )}

      {user.role == ROLES.AVP && (
        <nav className="space-y-1">
          <Link to="/dashboard">
            <Button
              variant="ghost"
              className="w-full justify-start hover:bg-gray-700 text-white"
            >
              <LayoutDashboard className="mr-2 h-4 w-4" />
              Dashboard
            </Button>
          </Link>

          <CollapsibleNavGroup
            title="Competitions"
            icon={<Trophy className="mr-2 h-4 w-4" />}
          >
            <Link to={"/crud/competitions"}>
              <Button
                variant="ghost"
                className="w-full justify-start pl-8 hover:bg-gray-800"
              >
                Manage Team Submissions
              </Button>
            </Link>
          </CollapsibleNavGroup>

          <CollapsibleNavGroup
            title="Recruitment"
            icon={<Users className="mr-2 h-4 w-4" />}
          >
            <Button
              variant="ghost"
              className="w-full justify-start pl-8 hover:bg-gray-800"
            >
              Review Deputy Head Applications
            </Button>
          </CollapsibleNavGroup>

          <CollapsibleNavGroup
            title="Meetings"
            icon={<Calendar className="mr-2 h-4 w-4" />}
          >
            <Button
              variant="ghost"
              className="w-full justify-start pl-8 hover:bg-gray-800"
            >
              Schedule with Heads/Deputies
            </Button>
          </CollapsibleNavGroup>

          <CollapsibleNavGroup
            title="Tasks"
            icon={<ListChecks className="mr-2 h-4 w-4" />}
          >
            <Link to="/tasks">
              <Button
                variant="ghost"
                className="w-full justify-start pl-8 hover:bg-gray-800"
              >
                Assign to Heads
              </Button>
            </Link>
          </CollapsibleNavGroup>

          <Button
            variant="ghost"
            className="w-full justify-start hover:bg-gray-800"
          >
            <UserCircle className="mr-2 h-4 w-4" />
            Profile
          </Button>
        </nav>
      )}

      {user.role == ROLES.HEAD && (
        <nav className="space-y-1">
          <Link to="/dashboard">
            <Button
              variant="ghost"
              className="w-full justify-start hover:bg-gray-700 text-white"
            >
              <LayoutDashboard className="mr-2 h-4 w-4" />
              Dashboard
            </Button>
          </Link>

          <CollapsibleNavGroup
            title="Competitions"
            icon={<Trophy className="mr-2 h-4 w-4" />}
          >
            <Link to={"/crud/competitions"}>
              <Button
                variant="ghost"
                className="w-full justify-start pl-8 hover:bg-gray-800"
              >
                Register Team Participants
              </Button>
            </Link>
          </CollapsibleNavGroup>

          <CollapsibleNavGroup
            title="Recruitment"
            icon={<Users className="mr-2 h-4 w-4" />}
          >
            <Button
              variant="ghost"
              className="w-full justify-start pl-8 hover:bg-gray-800"
            >
              Nominate Officers
            </Button>
          </CollapsibleNavGroup>

          <CollapsibleNavGroup
            title="Meetings"
            icon={<Calendar className="mr-2 h-4 w-4" />}
          >
            <Button
              variant="ghost"
              className="w-full justify-start pl-8 hover:bg-gray-800"
            >
              Attend/Report to AVP
            </Button>
          </CollapsibleNavGroup>

          <CollapsibleNavGroup
            title="Tasks"
            icon={<ListChecks className="mr-2 h-4 w-4" />}
          >
            <Link to="/tasks">
              <Button
                variant="ghost"
                className="w-full justify-start pl-8 hover:bg-gray-800"
              >
                Assign to Deputies
              </Button>
            </Link>
          </CollapsibleNavGroup>

          <Button
            variant="ghost"
            className="w-full justify-start hover:bg-gray-800"
          >
            <UserCircle className="mr-2 h-4 w-4" />
            Profile
          </Button>
        </nav>
      )}

      {user.role == ROLES.DEPUTY && (
        <nav className="space-y-1">
          <Link to="/dashboard">
            <Button
              variant="ghost"
              className="w-full justify-start hover:bg-gray-700 text-white"
            >
              <LayoutDashboard className="mr-2 h-4 w-4" />
              Dashboard
            </Button>
          </Link>

          <CollapsibleNavGroup
            title="Meetings"
            icon={<Calendar className="mr-2 h-4 w-4" />}
          >
            <Button
              variant="ghost"
              className="w-full justify-start pl-8 hover:bg-gray-800"
            >
              Attend/Report to Head
            </Button>
          </CollapsibleNavGroup>

          <CollapsibleNavGroup
            title="Tasks"
            icon={<ListChecks className="mr-2 h-4 w-4" />}
          >
            <Link to="/tasks">
              <Button
                variant="ghost"
                className="w-full justify-start pl-8 hover:bg-gray-800"
              >
                Assign to Ofiicers
              </Button>
            </Link>
          </CollapsibleNavGroup>

          <Button
            variant="ghost"
            className="w-full justify-start hover:bg-gray-800"
          >
            <UserCircle className="mr-2 h-4 w-4" />
            Profile
          </Button>
        </nav>
      )}

      {user.role == ROLES.OFFICER && (
        <nav className="space-y-1">
          <Link to="/dashboard">
            <Button
              variant="ghost"
              className="w-full justify-start hover:bg-gray-700 text-white"
            >
              <LayoutDashboard className="mr-2 h-4 w-4" />
              Dashboard
            </Button>
          </Link>

          <CollapsibleNavGroup
            title="Tasks"
            icon={<ListChecks className="mr-2 h-4 w-4" />}
          >
            <Link to="/tasks">
              <Button
                variant="ghost"
                className="w-full justify-start pl-8 hover:bg-gray-800"
              >
                Submit Work
              </Button>
            </Link>

            <Link to="">
              <Button
                variant="ghost"
                className="w-full justify-start pl-8 hover:bg-gray-800"
              >
                Request Clarifications
              </Button>
            </Link>
          </CollapsibleNavGroup>

          <Button
            variant="ghost"
            className="w-full justify-start hover:bg-gray-800"
          >
            <UserCircle className="mr-2 h-4 w-4" />
            Profile
          </Button>
        </nav>
      )}
    </div>
  );
};

function CollapsibleNavGroup({ title, icon, children }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="space-y-1">
      <Button
        variant="ghost"
        className="w-full justify-start hover:bg-gray-800"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        {icon}
        {title}
        <ChevronDown
          className={`ml-auto h-4 w-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""
            }`}
        />
      </Button>
      <div
        className={`ml-4 space-y-1 overflow-hidden transition-all duration-200 ${isOpen ? "max-h-96" : "max-h-0"
          }`}
      >
        {children}
      </div>
    </div>
  );
}
export default SideBar;
