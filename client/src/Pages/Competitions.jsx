import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import aiinnovation from "../assets/aiproduct.png";
import appdev from "../assets/appdev.png";
import bridge from "../assets/bridge.png";
import cadwar from "../assets/cadwar.png";
import cinematography from "../assets/cinematography.png";
import cyber from "../assets/cybersecurity.png";
import dv from "../assets/datavisualization.png";
import epc from "../assets/engineeringproject.png";
import gamejam from "../assets/gamejam.png";
import genX from "../assets/genxgaming.png";
import ix from "../assets/ix.png";
import lfr from "../assets/lfr-competition.png";
import ml from "../assets/MLC.png";
import pc from "../assets/pc.png";
import qm from "../assets/querymaster.png";
import robo from "../assets/robo.png";
import sketch from "../assets/sketching.png";
import spc from "../assets/spc.png";
import ui from "../assets/uiux.png";
import web from "../assets/web.png";
import softec from "../assets/softecLogo.png";
import { Link } from "react-router-dom";
const competitions = [
  {
    id: 1,
    name: "AI Innovation",
    image: aiinnovation,
    details:
      "Registration Fee: 5000\nMax Members: 5\nWinner:100,000\nRunnerUp:50,000",
  },
  {
    id: 2,
    name: "App Development",
    image: appdev,
    details:
      "Registration Fee: 2,500\nMax Members: 3\nWinner:60,000\nRunnerUp:30,000",
  },
  {
    id: 3,
    name: "Bridge Construction",
    image: bridge,
    details:
      "Registration Fee: 1,500\nMax Members: 2\nWinner:25,000\nRunnerUp:10,000",
  },
  {
    id: 4,
    name: "Cadwar",
    image: cadwar,
    details:
      "Registration Fee: 1,500\nMax Members: 1\nWinner:25,000\nRunnerUp:10,000",
  },
  {
    id: 5,
    name: "Cinematography",
    image: cinematography,
    details:
      "Registration Fee: 1,200\nMax Members: 1\nWinner:15,000\nRunnerUp:7,500",
  },
  {
    id: 6,
    name: "Cybersecurity",
    image: cyber,
    details:
      "Registration Fee: 2000\nMax Members: 3\nWinner:50,000\nRunnerUp:25,000",
  },
  {
    id: 7,
    name: "Data Visualization",
    image: dv,
    details:
      "Registration Fee: 2000\nMax Members: 2\nWinner:50,000\nRunnerUp:25,000",
  },
  {
    id: 8,
    name: "Engineering Project Competition",
    image: epc,
    details:
      "Registration Fee: 3000\nMax Members: 4\nWinner:70,000\nRunnerUp:35,000",
  },
  {
    id: 17,
    name: "Free Hand Sketching Competition",
    image: sketch,
    details:
      "Registration Fee: 1000\nMax Members: 1\nWinner:15,000\nRunnerUp:10,000",
  },
  {
    id: 9,
    name: "Game Jam",
    image: gamejam,
    details:
      "Registration Fee: 2,500\nMax Members: 4\nWinner:50,000\nRunnerUp:25,000",
  },
  {
    id: 10,
    name: "GenX Gaming",
    image: genX,
    details:
      "Registration Fee: 500\nMax Members: 5\nWinner:100,000\nRunnerUp:50,000",
  },
  {
    id: 11,
    name: "Ideas Xtreme",
    image: ix,
    details:
      "Registration Fee: 5000\nMax Members: 5\nWinner:100,000\nRunnerUp:50,000",
  },
  {
    id: 12,
    name: "Line Following Robot",
    image: lfr,
    details:
      "Registration Fee: 5000\nMax Members: 5\nWinner:100,000\nRunnerUp:50,000",
  },
  {
    id: 13,
    name: "Machine Learning Competition",
    image: ml,
    details:
      "Registration Fee: 5000\nMax Members: 5\nWinner:100,000\nRunnerUp:50,000",
  },
  {
    id: 14,
    name: "Programming Competition",
    image: pc,
    details:
      "Registration Fee: 5000\nMax Members: 5\nWinner:100,000\nRunnerUp:50,000",
  },
  {
    id: 15,
    name: "Query Master",
    image: qm,
    details:
      "Registration Fee: 5000\nMax Members: 5\nWinner:100,000\nRunnerUp:50,000",
  },
  {
    id: 16,
    name: "Robo Rumble",
    image: robo,
    details:
      "Registration Fee: 5000\nMax Members: 5\nWinner:100,000\nRunnerUp:50,000",
  },
  {
    id: 18,
    name: "Software Project Competition",
    image: spc,
    details:
      "Registration Fee: 5000\nMax Members: 5\nWinner:100,000\nRunnerUp:50,000",
  },
  {
    id: 19,
    name: "UI/UX Competition",
    image: ui,
    details:
      "Registration Fee: 5000\nMax Members: 5\nWinner:100,000\nRunnerUp:50,000",
  },
  {
    id: 20,
    name: "Web Development Hackathon",
    image: web,
    details:
      "Registration Fee: 5000\nMax Members: 5\nWinner:100,000\nRunnerUp:50,000",
  },
];

function Competitions() {
  const [activeCompetition, setActiveCompetition] = useState(null);

  const toggleDetails = (id) => {
    setActiveCompetition((prev) => (prev === id ? null : id));
  };

  return (
    <div>
      {/* Navigation
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
          />
        </div>
      </nav> */}

      <div className="container mx-auto p-6">
        {/* Add margin-bottom to the heading */}
        <h1 className="text-2xl font-bold text-center text-purple-700 mb-6">
          Competitions
        </h1>

        {/* Cards Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {competitions.map((competition) => (
            <Card
              key={competition.id}
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => toggleDetails(competition.id)}
            >
              <CardHeader>
                <img
                  src={competition.image}
                  alt={competition.name}
                  className={`object-contain mx-auto ${[
                      "AI Innovation",
                      "Cinematography",
                      "LFR Competition",
                    ].includes(competition.name)
                      ? "w-45 h-45"
                      : "w-32 h-45"
                    }`}
                />
              </CardHeader>
              <CardContent>
                <h2 className="text-lg font-medium text-center">
                  {competition.name}
                </h2>
              </CardContent>
              {activeCompetition === competition.id && (
                <CardFooter className="flex flex-col items-center">
                  <p className="text-lg text-purple-700">Details</p>
                  <p className="text-sm text-gray-700">{competition.details}</p>
                  <button className="mt-4 px-2 py-1 border border-black text-black rounded hover:bg-gradient-to-r hover:from-purple-500 hover:to-blue-400 hover:text-white">
                    Download Complete Details
                  </button>
                  {/* <Link to="/competitions/register"> */}
                  <button className="mt-4 px-4 py-2 border border-black bg-purple-500 text-white rounded hover:bg-purple-600">
                    Register Now
                  </button>
                  {/* </Link> */}
                </CardFooter>
              )}
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Competitions;
