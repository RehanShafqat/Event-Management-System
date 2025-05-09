import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import softec from "../assets/softecLogo.png";

const ApplicationForm = () => {
  // State hooks for form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [discipline, setDiscipline] = useState("");
  const [batch, setBatch] = useState("");
  const [rollNumber, setRollNumber] = useState("");
  const [selectedDepartments, setSelectedDepartments] = useState([]);

  const departments = [
    "Accomodation",
    "App Dev Competition",
    "Artificial Intelligence Competition",
    "Automation",
    "Bridge Construction Competition",
    "CAD War Competition",
    "Ceremonies",
    "Conferences",
    "Cyber Security Competition",
    "Data Visualisation Competition",
    "Decor",
    "Engineering Project Competition",
    "Evaluations",
    "FoodCourt",
    "Game Jam Competition",
    "Gaming Competition",
    "Graphic Design",
    "Ideas Xtreme",
    "Infrastructure",
    "International Affairs",
    "Invitations",
    "Logistics",
    "Marketing",
    "Media and Promotions",
    "Office",
    "Partnerships",
    "Photography",
    "Programming Competition",
    "Public Relations",
    "Query Master Competition",
    "Reception",
    "Robo Rumble",
    "Security",
    "Sketching Competition",
    "Software House Enclosure",
    "Software Project Competition",
    "UI/UX Competition",
    "Videography",
    "Web Development Competition",
  ];

  const toggleDepartment = (dept) => {
    setSelectedDepartments((prev) =>
      prev.includes(dept) ? prev.filter((d) => d !== dept) : [...prev, dept]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name) {
      alert("Please enter your name.");
      return;
    }
    if (!email) {
      alert("Please enter your email.");
      return;
    }
    if (!phone) {
      alert("Please enter your phone number.");
      return;
    }
    if (phone.length < 11 || phone.length > 11) {
      alert("Please enter a valid phone number.");
      return;
    }
    if (!discipline || discipline === "initialvalue") {
      alert("Please select a valid discipline.");
      return;
    }
    if (!batch || batch === "initialvalue") {
      alert("Please select a valid batch.");
      return;
    }
    if (!rollNumber) {
      alert("Please enter your roll number.");
      return;
    }
    if (selectedDepartments.length === 0) {
      alert("Please select at least one department.");
      return;
    }
    console.log({
      name,
      email,
      phone,
      discipline,
      batch,
      rollNumber,
      selectedDepartments,
    });
    alert("Application submitted successfully!");

    setName("");
    setEmail("");
    setPhone("");
    setDiscipline("");
    setBatch("");
    setRollNumber("");
    setSelectedDepartments([]);
  };

  return (
    <div>
      {/* Navigation */}
      {/* <nav className="w-full h-20 bg-zinc-800 flex items-center px-6">
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
          />
        </div>
      </nav> */}

      {/* Form  */}
      <div className="w-full max-w-2xl mx-auto mt-10 bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold text-center text-purple-700">
          Registration
        </h2>
        <p className="text-center text-gray-500 mb-6">
          Join Us Today – Fill Out Your Application Below
        </p>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/*  Name */}
          <div>
            <Label
              htmlFor="full-name"
              className="block text-sm font-medium text-gray-700 text-left"
            >
              Full Name *
            </Label>
            <Input
              id="full-name"
              type="text"
              placeholder="John Doe"
              className="mt-1 w-full"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          {/* Email */}
          <div>
            <Label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 text-left"
            >
              Email *
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="johndoe@example.com"
              className="mt-1 w-full"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Phone Number */}
          <div>
            <Label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700 text-left"
            >
              Phone Number *
            </Label>
            <Input
              id="phone"
              type="tel"
              placeholder="03XX-XXXXXXX"
              className="mt-1 w-full"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>

          {/* Discipline */}
          <div>
            <Label
              htmlFor="discipline"
              className="block text-sm font-medium text-gray-700 text-left"
            >
              Discipline *
            </Label>
            <Select
              value={discipline}
              onValueChange={(val) => setDiscipline(val)}
            >
              <SelectTrigger id="discipline" className="mt-1 w-full">
                <SelectValue placeholder="Select discipline" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="initialvalue">Select discipline</SelectItem>
                <SelectItem value="a&f">Accounting and Finance</SelectItem>
                <SelectItem value="ai">Artificial Intelligence</SelectItem>
                <SelectItem value="ba">Business Analytics</SelectItem>
                <SelectItem value="bba">BBA</SelectItem>
                <SelectItem value="civil">Civil Engineering</SelectItem>
                <SelectItem value="computer-science">
                  Computer Science
                </SelectItem>
                <SelectItem value="dataScience">Data Science</SelectItem>
                <SelectItem value="electrical-engineering">
                  Electrical Engineering
                </SelectItem>
                <SelectItem value="fintech">FinTech</SelectItem>
                <SelectItem value="software-engineering">
                  Software Engineering
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Batch */}
          <div>
            <Label
              htmlFor="batch"
              className="block text-sm font-medium text-gray-700 text-left"
            >
              Batch *
            </Label>
            <Select value={batch} onValueChange={(val) => setBatch(val)}>
              <SelectTrigger id="batch" className="mt-1 w-full">
                <SelectValue placeholder="Select batch" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="initialvalue">Select batch</SelectItem>
                <SelectItem value="2020">2020</SelectItem>
                <SelectItem value="2021">2021</SelectItem>
                <SelectItem value="2022">2022</SelectItem>
                <SelectItem value="2023">2023</SelectItem>
                <SelectItem value="2024">2024</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Roll Number */}
          <div>
            <Label
              htmlFor="roll-number"
              className="block text-sm font-medium text-gray-700 text-left"
            >
              Roll Number *
            </Label>
            <Input
              id="roll-number"
              type="text"
              placeholder="20L-1234"
              className="mt-1 w-full"
              value={rollNumber}
              onChange={(e) => setRollNumber(e.target.value)}
              required
            />
          </div>

          {/*  Departments */}
          <div>
            <Label className="block text-sm font-medium text-gray-700 text-left mb-2">
              Select Departments *
            </Label>
            <div className="flex flex-wrap gap-2">
              {departments.map((dept) => (
                <Button
                  key={dept}
                  type="button"
                  variant="outline"
                  className={`border rounded-full px-4 py-1 text-sm ${
                    selectedDepartments.includes(dept)
                      ? "bg-purple-500 text-white border-purple-700"
                      : "bg-white text-black border-purple-700"
                  }`}
                  onClick={() => toggleDepartment(dept)}
                >
                  + {dept}
                </Button>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full bg-purple-700 text-white font-medium bg-gradient-to-r from-purple-700 via-purple-700 to-purple-700 hover:bg-gradient-to-r hover:via-purple-600 hover:to-blue-500"
          >
            Submit Application
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ApplicationForm;
