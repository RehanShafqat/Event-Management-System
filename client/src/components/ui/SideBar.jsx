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
  const canAccessCompetitions = user?.role && [ROLES.PRESIDENT].includes(user.role);
  const canAccessRecruitment = user?.role && [ROLES.PRESIDENT, ROLES.VP, ROLES.AVP, ROLES.HEAD, ROLES.DEPUTY].includes(user.role);

  return (
    <div className="fixed left-0 w-60 text-white p-4 border-r border-gray   bg-[#020618] min-h-screen">
      {/* Common navigation items for all roles */}
      <nav className="space-y-1">
        <Link to="/dashboard">
          <Button
            variant="ghost"
            className="w-full justify-start  -700 text-white"
          >
            <LayoutDashboard className="mr-2 h-4 w-4" />
            Dashboard
          </Button>
        </Link>

        {/* Competitions Section - Only accessible by President and VP */}
        {canAccessCompetitions && (
          <CollapsibleNavGroup
            title="Competitions"
            icon={<Trophy className="mr-2 h-4 w-4" />}
          >
            <Link to={"/crud/competitions"}>
              <Button
                variant="ghost"
                className="w-full justify-start pl-8    "
              >
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
          >
            {user.role === ROLES.PRESIDENT && (
              <>
                <Link to="/recruitment/applications">
                  <Button
                    variant="ghost"
                    className="w-full justify-start pl-8    "
                  >
                    Review Applications
                  </Button>
                </Link>

              </>
            )}
            {user.role === ROLES.VP && (
              <>
                <Link to="/recruitment/applications">
                  <Button
                    variant="ghost"
                    className="w-full justify-start pl-8    "
                  >
                    Review AVP/Head Applications
                  </Button>
                </Link>
                <Link to="/recruitment/apply">
                  <Button
                    variant="ghost"
                    className="w-full justify-start pl-8    "
                  >
                    Initiate Recruitment Drives
                  </Button>
                </Link>
              </>
            )}
            {user.role === ROLES.AVP && (
              <Link to="/recruitment/applications">
                <Button
                  variant="ghost"
                  className="w-full justify-start pl-8    "
                >
                  Review Head Applications
                </Button>
              </Link>
            )}
            {user.role === ROLES.HEAD && (
              <Link to="/recruitment/applications">
                <Button
                  variant="ghost"
                  className="w-full justify-start pl-8    "
                >
                  Nominate Deputies
                </Button>
              </Link>
            )}
            {
              user.role === ROLES.DEPUTY && (
                <Link to="/recruitment/applications">
                  <Button
                    variant="ghost"
                    className="w-full justify-start pl-8    "
                  >
                    Nominate Officers
                  </Button>
                </Link>
              )
            }
          </CollapsibleNavGroup>
        )}

        {/* Meetings Section - Accessible by all roles */}
        <CollapsibleNavGroup
          title="Meetings"
          icon={<Calendar className="mr-2 h-4 w-4" />}
        >
          <Link to="/meetings">
            <Button
              variant="ghost"
              className="w-full justify-start pl-8    "
            >
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
        >
          <Link to="/tasks">
            <Button
              variant="ghost"
              className="w-full justify-start pl-8 "
            >
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
        <Link to="/profile">
          <Button
            variant="ghost"
            className="w-full justify-start    "
          >
            <UserCircle className="mr-2 h-4 w-4" />
            Profile
          </Button>
        </Link>
      </nav>
    </div>
  );
};

function CollapsibleNavGroup({ title, icon, children }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="space-y-1">
      <Button
        variant="ghost"
        className="w-full justify-start    "
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
