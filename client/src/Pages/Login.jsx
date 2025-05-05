import React from "react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import softec from "../assets/softecLogo.png"
import { Link } from 'react-router-dom';
const Login = () => {
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [name,setName]=useState("");

  const handleSubmit = (e) => {   
    e.preventDefault();
    if (!role || role === "initial") {
      alert("Please select a valid role.");
      return;
    }
    if(!name){
      alert("Please enter name.");
      return;
    }
    if (password.length < 8) {
      alert("Password must be at least 8 characters.");
      return;
    }
    console.log({
      name,
      role,
      password,
    });
    alert("Login successful!");

  
  setName("");
  setRole("");
  setPassword("");

  };
  return (
    <div >
      
      <nav className="w-full h-20 bg-zinc-800 flex items-center px-6">
        <div className="flex items-center gap-4">
          <img
            src={softec}
            alt="Logo"
            className="h-20" 
            style={{
              width: "auto", 
              opacity: 0.9, 
              filter: "brightness(1.2)",
            }}
      ></img>
        </div>
      </nav>

      
      <div className="max-w-lg mx-auto mt-10 bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold text-center text-purple-700">Welcome</h2>
        <p className="text-center text-gray-500 mb-6">Sign in to continue</p>

        <form className="space-y-4" onSubmit={handleSubmit}>
          
          <div>
            <Label htmlFor="username" className="block text-sm font-medium text-gray-700 text-left">
              Full Name *
            </Label>
            <Input
              id="username"
              type="text"
              placeholder="John Doe"
              className="mt-1 w-full"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          
          <div>
            <Label htmlFor="role" className="block text-sm font-medium text-gray-700 text-left">
              Role *
            </Label>
            <Select value={role} onValueChange={(val) => setRole(val)}>
              <SelectTrigger id="role" className="mt-1 w-full">
                <SelectValue placeholder="Select your role" />
              </SelectTrigger>
              <SelectContent>
              <SelectItem value="initial">Select your role</SelectItem>
                <SelectItem value="officer">Officer</SelectItem>
                <SelectItem value="deputy">Deputy Head</SelectItem>
                <SelectItem value="head">Head</SelectItem>
                <SelectItem value="avp">Assistant Vice President</SelectItem>
                <SelectItem value="vp">Vice President</SelectItem>
                <SelectItem value="president">President</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="password" className="block text-sm font-medium text-gray-700 text-left">
              Password *
            </Label>
            <Input
              id="password"
              type="password"
              className="mt-1 w-full"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={8}
              required
            />
          </div>

          
          <div className="text-right">
            <a href="#" className="text-sm text-blue-600 hover:underline">
              Forgot Password?
            </a>
          </div>

          
          <Button 
            type="submit"
              className="w-full bg-purple-700 text-white font-medium bg-gradient-to-r from purple-700 via-purple-700 to-purple-700 hover: bg-gradient-to-r from-purple-700 hover:via-purple-600 hover:to-blue-500"
          >
            Login
          </Button>
          <div className="text-center">
            <Link to="/apply" className="text-sm text-black hover:underline hover:text-blue-600">
            Not a part of SOFTEC? Apply Now!
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;