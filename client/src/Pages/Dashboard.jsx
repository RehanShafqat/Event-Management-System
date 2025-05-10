// pages/Dashboard.js
import { useSelector } from "react-redux";
import { PresidentDashboard } from "./PresidentDashboard";
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
        return <PresidentDashboard />;
      case ROLES.VP:
        return <VPDashboard />;
      default:
        return <DefaultDashboard />;
    }
  };

  return <div>{getRoleSpecificContent()}</div>;
};

const VPDashboard = () => <div>VP Content</div>;
const DefaultDashboard = () => <div>Default Content</div>;

export default Dashboard;
