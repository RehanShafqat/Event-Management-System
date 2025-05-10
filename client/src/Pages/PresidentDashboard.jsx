import {
  LayoutDashboard,
  Trophy,
  Users,
  UserCircle,
  ChevronDown,
  Bell,
  Search,
  ClipboardList,
  CirclePlus,
  Network,
  Calendar,
  ListChecks,
  GanttChart,
  LogOut,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../Redux/features/authentication/authSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import api from "../api/auth";
import { useEffect } from "react";

export function PresidentDashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.authentication)

  const handleLogout = async () => {
    try {
      await api.auth.logout();
      dispatch(logout());
      toast.success("Logged out successfully");
      navigate("/login");
    } catch {
      toast.error("Failed to logout");
    }
  };

  return (
    <div className="min-h-screen bg-[#0e0e0e]">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-[#0e0e0e] text-white p-4 border-r border-gray-800">
        <div className="flex items-center space-x-2 mb-8 p-2">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-[#e50914] text-white font-bold">
              S
            </AvatarFallback>
          </Avatar>
          <h1 className="text-xl font-bold">Softec</h1>
        </div>

        <nav className="space-y-1">
          <Button
            variant="ghost"
            className="w-full justify-start bg-gray-800 hover:bg-gray-700 text-white"
          >
            <LayoutDashboard className="mr-2 h-4 w-4" />
            Dashboard
          </Button>

          <CollapsibleNavGroup
            title="Competitions"
            icon={<Trophy className="mr-2 h-4 w-4" />}
          >
            <Button
              variant="ghost"
              className="w-full justify-start pl-8 text-gray-300 hover:bg-gray-800"
            >
              Manage Competitions
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start pl-8 text-gray-300 hover:bg-gray-800"
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
              className="w-full justify-start pl-8 text-gray-300 hover:bg-gray-800"
            >
              Review Applications
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start pl-8 text-gray-300 hover:bg-gray-800"
            >
              Initiate Recruitment Drives
            </Button>
          </CollapsibleNavGroup>

          <CollapsibleNavGroup
            title="Hierarchy"
            icon={<Network className="mr-2 h-4 w-4" />}
          >
            <Button
              variant="ghost"
              className="w-full justify-start pl-8 text-gray-300 hover:bg-gray-800"
            >
              Assign Roles
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start pl-8 text-gray-300 hover:bg-gray-800"
            >
              View Hierarchy
            </Button>
          </CollapsibleNavGroup>

          <CollapsibleNavGroup
            title="Meetings"
            icon={<Calendar className="mr-2 h-4 w-4" />}
          >
            <Button
              variant="ghost"
              className="w-full justify-start pl-8 text-gray-300 hover:bg-gray-800"
            >
              Schedule Meeting
            </Button>
          </CollapsibleNavGroup>

          <CollapsibleNavGroup
            title="Tasks"
            icon={<ListChecks className="mr-2 h-4 w-4" />}
          >
            <Button
              variant="ghost"
              className="w-full justify-start pl-8 text-gray-300 hover:bg-gray-800"
            >
              Assign Tasks
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start pl-8 text-gray-300 hover:bg-gray-800"
            >
              Track Progress of Tasks
            </Button>
          </CollapsibleNavGroup>

          <Button
            variant="ghost"
            className="w-full justify-start text-gray-300 hover:bg-gray-800"
          >
            <UserCircle className="mr-2 h-4 w-4" />
            Profile
          </Button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="ml-64 p-8">
        <header className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-white">President Dashboard</h2>
          <div className="flex items-center space-x-4">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search..."
                className="pl-10 bg-gray-800 border-gray-700 text-white focus:border-my-purple"
              />
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-300 hover:bg-gray-800"
            >
              <Bell className="h-5 w-5" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-my-purple text-white">
                      {user.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-[#1a1a1a] border-gray-800" align="end" forceMount>
                <DropdownMenuLabel className="font-normal text-gray-300">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.name}</p>
                    <p className="text-xs leading-none text-gray-400">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-gray-800" />
                <DropdownMenuItem
                  className="text-gray-300 focus:bg-gray-800 focus:text-white cursor-pointer"
                  onClick={() => navigate("/profile")}
                >
                  <UserCircle className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-gray-300 focus:bg-gray-800 focus:text-white cursor-pointer"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
          <StatCard
            title="Active Competitions"
            value={12}
            change={2}
            icon={<Trophy className="h-5 w-5 text-[#e50914]" />}
          />
          <StatCard
            title="Pending Applications"
            value={24}
            change={5}
            icon={<Users className="h-5 w-5 text-my-purple" />}
          />
          {/* More stat cards */}
        </div>

        {/* Recent Activity */}
        <div className="grid gap-4 lg:grid-cols-3 mb-6">
          <Card className="lg:col-span-2 bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ActivityItem
                title="New competition submission"
                description="Hackathon 2023 submitted by Tech Team"
                time="2h ago"
                icon={<Trophy className="h-4 w-4 text-[#e50914]" />}
              />
              {/* More activity items */}
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
              >
                <Trophy className="mr-2 h-4 w-4 text-[#e50914]" />
                Approve New Competition
              </Button>
              {/* More quick actions */}
            </CardContent>
          </Card>
        </div>

        {/* Performance Chart */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Team Performance</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            {/* Chart would be implemented here */}
            <div className="flex items-center justify-center h-full bg-gray-700 rounded-lg">
              <p className="text-sm text-gray-400">
                Performance chart visualization
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Custom Components
function CollapsibleNavGroup({ title, icon, children }) {
  return (
    <div className="space-y-1">
      <Button
        variant="ghost"
        className="w-full justify-start text-gray-300 hover:bg-gray-800"
      >
        {icon}
        {title}
        <ChevronDown className="ml-auto h-4 w-4" />
      </Button>
      <div className="ml-4 space-y-1">{children}</div>
    </div>
  );
}

function StatCard({ title, value, change, icon }) {
  const isPositive = change >= 0;

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-gray-300">
          {title}
        </CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-white">{value}</div>
        <p
          className={`text-xs ${isPositive ? "text-green-400" : "text-red-400"
            }`}
        >
          {isPositive ? "+" : ""}
          {change} from last week
        </p>
      </CardContent>
    </Card>
  );
}

function ActivityItem({ title, description, time, icon }) {
  return (
    <div className="flex items-start gap-4">
      <div className="bg-gray-700 p-2 rounded-lg">{icon}</div>
      <div className="flex-1">
        <h4 className="font-medium text-white">{title}</h4>
        <p className="text-sm text-gray-400">{description}</p>
      </div>
      <Badge
        variant="outline"
        className="ml-auto bg-gray-700 border-gray-600 text-gray-300"
      >
        {time}
      </Badge>
    </div>
  );
}
