import React from "react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import softec from "../assets/softec.svg";
const SignUp = () => {
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [name,setName]=useState("");
  const [gender,setGender]=useState("");

  const handleGender=(e)=>{
    if(e.target.checked){
    setGender(e.target.value);
  }
  }
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
    alert("SignUp successful!");

  
  setName("");
  setRole("");
  setPassword("");
  setGender("");

  };
  return (
    <div >
      
      <div className="max-w-lg mx-auto mt-10 bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold text-center text-purple-700">Welcome</h2>
        <p className="text-center text-gray-500 mb-6">Sign Up to continue</p>

        <form className="space-y-4" onSubmit={handleSubmit}>
          
          <div>
            <Label htmlFor="username" className="block text-sm font-medium text-gray-700 text-left">
              Full Name *
            </Label>
            <Input
              id="username"
              type="text"
              placeholder="Enter your Full Name"
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
            <Label className="inline-block w-50"htmlFor="gender"> Gender *</Label>
            <input type="radio" id="male" name="gender" value="male" onChange={(e)=>{handleGender(e)}}/> <Label className="inline-block w-30" htmlFor="male">Male</Label>
            <input type="radio" id="female" name="gender" value="female" onChange={(e)=>{handleGender(e)}}/> <Label className="inline-block"htmlFor="female">Female</Label>
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

          <Button 
            type="submit"
              className="w-full bg-purple-700 text-white font-medium bg-gradient-to-r from purple-700 via-purple-700 to-purple-700 hover: from-purple-700 hover:via-purple-600 hover:to-blue-500"
            onClick={()=>{
            }}
          >
            SignUp
          </Button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;