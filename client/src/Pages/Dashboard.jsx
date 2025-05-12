// pages/Dashboard.js
import { useSelector } from "react-redux";
import { PresidentDashboard } from "./PresidentDashboard";
import { HeadDashboard } from "./HeadDashboard";
import { DeputyDashboard } from "./DeputyDashboard";
import { OfficerDashboard } from "./OfficerDashboard";
import { useEffect } from "react";
import { ROLES } from "../utils/roles";

const Dashboard = () => {
  const { user } = useSelector((state) => state.authentication);

  useEffect(() => {
    console.log("ROLE: ", user.role);
  }, [user.role]);

  const getRoleSpecificContent = () => {
    switch (user.role) {
      case ROLES.PRESIDENT:
      case ROLES.VP:
        return <PresidentDashboard />;
      case ROLES.AVP:
      case ROLES.HEAD:
        return <HeadDashboard />;
      case ROLES.DEPUTY:
        return <DeputyDashboard />;
      case ROLES.OFFICER:
        return <OfficerDashboard />;
      default:
        return <DefaultDashboard />;
    }
  };

  return <div>{getRoleSpecificContent()}</div>;
};

const DefaultDashboard = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="text-center">
      <h1 className="text-2xl font-bold mb-2">Welcome</h1>
      <p className="text-muted-foreground">Please contact an administrator if you cannot access your dashboard.</p>
    </div>
  </div>
);

export default Dashboard;
