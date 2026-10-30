import React, { useState } from "react";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

import "../styles/dashboardLayout.css";

const DashboardLayout = ({ children }) => {

  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  const openSidebar = () => {
    setSidebarOpen(true);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="dashboard-layout">

      <Sidebar
        isOpen={sidebarOpen}
        onClose={closeSidebar}
      />

      <div className="dashboard-main">

        <Navbar
          onMenuClick={openSidebar}
        />

        <main className="dashboard-content">
          {children}
        </main>

      </div>

    </div>
  );
};

export default DashboardLayout;