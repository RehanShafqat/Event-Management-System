// components/MainNavBar.tsx
import { UserCircle, Bell, Search, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/Redux/features/authentication/authSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { ModeToggle } from "@/components/MyComponents/ModeToggle";

const LoginNavBar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.authentication);

  const handleLogout = async () => {
    try {
      dispatch(logout());
      toast.success("Logged out successfully");
      navigate("/login");
    } catch {
      toast.error("Failed to logout");
    }
  };

  return (
    <nav className="border-[#0f172a] py-4 px-6 flex items-center justify-between bg-[#0f172a] sticky top-0 z-50">
      {/* Left side - Brand and Dashboard title */}
      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-2">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-[#e50914] text-white font-bold">
              S
            </AvatarFallback>
          </Avatar>
          <h1 className="text-xl text-white font-bold">Softec</h1>
        </div>

        <h2 className="text-xl text-white font-semibold">
          {user.role + " Dashboard"}
        </h2>
      </div>

      {/* Right side - Search and User dropdown */}
      <div className="flex items-center space-x-4">
        {/* <Button
          variant="ghost"
          size="icon"
          className="text-gray-500 hover:bg-gray-100"
        >
          <Bell className="h-5 w-5" />
        </Button> */}
        <ModeToggle />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-[#e50914] text-white">
                  {user.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 border" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user.name}</p>
                <p className="text-xs leading-none">{user.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className=" cursor-pointer"
              onClick={() => navigate("/profile")}
            >
              <UserCircle className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
};

export default LoginNavBar;
