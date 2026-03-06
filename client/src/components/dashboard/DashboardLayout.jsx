import React, { useState } from "react";
import Sidebar from "./Sidebar";
import DashboardHeader from "./DashboardHeader";
import MobileNav from "./MobileNav";

const DashboardLayout = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);

  const toggleTheme = () => {
    document.documentElement.classList.toggle("dark");
    setDarkMode(!darkMode);
  };

  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-screen transition-colors duration-300">
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <DashboardHeader darkMode={darkMode} onToggleTheme={toggleTheme} />
          <div className="flex-1 overflow-y-auto custom-scrollbar p-4 lg:p-8 space-y-6 lg:space-y-8">
            {children}
          </div>
        </main>
      </div>
      <MobileNav />
    </div>
  );
};

export default DashboardLayout;
