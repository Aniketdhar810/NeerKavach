import React from "react";
import { useNavigate } from "react-router-dom";
import ThemeToggle from "../ThemeToggle";

const DashboardHeader = ({ darkMode, onToggleTheme }) => {
  const navigate = useNavigate();

  // Get user from localStorage
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userName = user.name || "User";
  const userRole = user.role === "reporter" ? "Reporter" : "Health User";
  const userDepartment = user.department || "";

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/signin");
  };

  return (
    <header className="h-16 lg:h-20 bg-white/80 dark:bg-slate-900/80 glass-effect border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 lg:px-8 z-20">
      {/* Left */}
      <div className="flex items-center gap-4 flex-1">
        <button className="lg:hidden text-slate-600 dark:text-slate-400">
          <span className="material-symbols-outlined">menu</span>
        </button>
      </div>

      {/* Right */}
      <div className="flex items-center gap-3 lg:gap-6">
        <ThemeToggle darkMode={darkMode} onToggle={onToggleTheme} />

        <div className="h-8 w-[1px] bg-slate-200 dark:bg-slate-700 mx-1 hidden sm:block" />

        {/* User */}
        <div className="flex items-center gap-3 cursor-pointer group relative">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-bold leading-tight">{userName}</p>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
              {userDepartment || userRole}
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center text-white font-bold group-hover:ring-2 ring-blue-500/20 transition-all">
            {userName.charAt(0).toUpperCase()}
          </div>

          {/* Dropdown menu on hover */}
          <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
            <div className="p-3 border-b border-slate-200 dark:border-slate-700">
              <p className="text-sm font-bold">{userName}</p>
              <p className="text-xs text-slate-400">{user.email}</p>
            </div>
            <div className="p-2">
              <button
                onClick={handleLogout}
                className="w-full text-left px-3 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-sm">logout</span>
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
