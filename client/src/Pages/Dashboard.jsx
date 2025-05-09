// pages/Dashboard.js
import { useSelector } from "react-redux";
import { PresidentDashboard } from "./PresidentDashboard";

const Dashboard = () => {
  const { role, currentUser } = useSelector((state) => state.authentication);

  const getRoleSpecificContent = () => {
    switch (role) {
      case "President":
        return <PresidentDashboard />;
      case "VP":
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
