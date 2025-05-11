import {
  LayoutDashboard,
  ClipboardList,
  Trophy,
  Users,
  Calendar,
  UserCircle,
  ChevronDown,
  Bell,
  Search,
  LogOut,
  FileText,
  ListChecks,
  BarChart2,
} from "lucide-react";
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
import api from "../api/apiCalls";


export function HeadDashboard(){
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.authentication);

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
    <div className="min-h-screen bg-[#161616]">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-[#161616] text-white p-4 border-r border-gray-800">
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
             Register Team Participants
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
            <Button
              variant="ghost"
              className="w-full justify-start pl-8 text-gray-300 hover:bg-gray-800"
            >
              Upcoming Meetings
            </Button>
          </CollapsibleNavGroup>

           <CollapsibleNavGroup
            title="Recruitement"
            icon={<Users className="mr-2 h-4 w-4" />}
          >
            <Button
              variant="ghost"
              className="w-full justify-start pl-8 text-gray-300 hover:bg-gray-800"
            >Add Officers
            </Button>
          </CollapsibleNavGroup>

          <CollapsibleNavGroup
            title="Tasks"
            icon={<ClipboardList className="mr-2 h-4 w-4" />}
          >
            <Button
              variant="ghost"
              className="w-full justify-start pl-8 text-gray-300 hover:bg-gray-800"
            >
              Assign Task to Deputy
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start pl-8 text-gray-300 hover:bg-gray-800"
            >
              Update AVP
            </Button>
             <Button
              variant="ghost"
              className="w-full justify-start pl-8 text-gray-300 hover:bg-gray-800"
            >
              Submit Task 
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start pl-8 text-gray-300 hover:bg-gray-800"
            >
              View My Tasks
            </Button>
           
            

          </CollapsibleNavGroup>
         
         
       
          <Button
            variant="ghost"
            className="w-full justify-start text-gray-300 hover:bg-gray-800"
            onClick={() => navigate("/profile")}
          >
            <UserCircle className="mr-2 h-4 w-4" />
            Profile
          </Button>
        </nav>
      </div>
      {/* Main Content */}
      <div className="ml-64 p-8">
        <header className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-white">Head Dashboard</h2>
          <div className="flex items-center space-x-4">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search..."
                className="pl-10 bg-gray-800 border-gray-700 text-white focus:border-blue-600"
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
                      {user?.name ? user.name.charAt(0) : "H"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-56 bg-[#1a1a1a] border-gray-800"
                align="end"
                forceMount
              >
                <DropdownMenuLabel className="font-normal text-gray-300">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user?.name || "Head"}
                    </p>
                    <p className="text-xs leading-none text-gray-400">
                      {user?.email || "Head@softec.com"}
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
            title="Assigned Tasks"
            value={8}
            change={1}
            icon={<ListChecks className="h-5 w-5 text-blue-500" />}
          />
          
           <StatCard
            title="Pending Tasks"
            value={6}
            change={1}
            icon={<ListChecks className="h-5 w-5 text-blue-500" />}
          />
          <StatCard
            title="Track Deputy Tasks"
             value={4}
            change={1}
            icon={<ListChecks className="h-5 w-5 text-blue-500" />}
            />
          
         
        </div>

        {/* Recent Activity and Quick Actions */}
        <div className="grid gap-4 lg:grid-cols-3 mb-6">
          <Card className="lg:col-span-2 bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ActivityItem
                title="Task Assigned"
                description="You assigned a task to Deputies."
                time="3h ago"
                icon={<ListChecks className="h-4 w-4 text-blue-500" />}
              />
             
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
                <ListChecks className="mr-2 h-4 w-4 text-blue-500" />
                Mark Task as Done
              </Button>
              
              
            </CardContent>
          </Card>
        </div>

        {/* Productivity Chart */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">
              Productivity Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <div className="flex items-center justify-center h-full bg-gray-700 rounded-lg">
              <BarChart2 className="w-12 h-12 text-gray-500 mr-4" />
              <p className="text-sm text-gray-400">
                Productivity chart visualization
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// CollapsibleNavGroup component
function CollapsibleNavGroup({ title, icon, children }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center w-full justify-between bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded"
      >
        <div className="flex items-center">
          {icon}
          <span>{title}</span>
        </div>
        <ChevronDown
          className={`h-4 w-4 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      <div className={`${isOpen ? "block" : "hidden"} mt-1`}>{children}</div>
    </div>
  );
}
// StatCard component
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
          className={`text-xs ${
            isPositive ? "text-green-400" : "text-red-400"
          }`}
        >
          {isPositive ? "+" : ""}
          {change} from last week
        </p>
      </CardContent>
    </Card>
  );
}

// ActivityItem component
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