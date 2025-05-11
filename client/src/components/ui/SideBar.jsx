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

const SideBar = () => {
  return (
    <div className="fixed left-0 w-60 text-white p-4 border-r border-gray-800 bg-[#020618] min-h-screen">
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
          <Link to="/meetings">
            <Button
              variant="ghost"
              className="w-full justify-start pl-8 hover:bg-gray-800"
            >
              Manage Meetings
            </Button>
          </Link>
        </CollapsibleNavGroup>

        <Link to="/tasks">
          <Button
            variant="ghost"
            className="w-full justify-start hover:bg-gray-700 text-white"
          >
            <ListChecks className="mr-2 h-4 w-4" />
            Tasks
          </Button>
        </Link>

        <Link to="/profile">
          <Button
            variant="ghost"
            className="w-full justify-start hover:bg-gray-700 text-white"
          >
            <UserCircle className="mr-2 h-4 w-4" />
            Profile
          </Button>
        </Link>
      </nav>
    </div>
  );
};

// Custom Components
function CollapsibleNavGroup({ title, icon, children }) {
  return (
    <div className="space-y-1">
      <Button
        variant="ghost"
        className="w-full justify-start hover:bg-gray-800"
      >
        {icon}
        {title}
        <ChevronDown className="ml-auto h-4 w-4" />
      </Button>
      <div className="ml-4 space-y-1">{children}</div>
    </div>
  );
}
export default SideBar;
