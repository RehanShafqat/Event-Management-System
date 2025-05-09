import { Outlet } from "react-router-dom";

const DashboardLayout = () => {
  return (
    <div className="dashboard-container">
      <DashboardSidebar />
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
