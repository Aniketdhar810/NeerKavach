import React from "react";
import { Link, useLocation } from "react-router-dom";

const commonMenu = [
  { label: "Dashboard", icon: "dashboard", path: "/dashboard" },
  { label: "Hotspot Map", icon: "map", path: "/hotspot-map" },
  { label: "Reports", icon: "description", path: "/my-reports" },
];

const reporterMenu = [
  { label: "Submit Test", icon: "file_upload", path: "/submit-test" },
];

const authorityMenu = [
  { label: "Surveillance", icon: "insights", path: "/surveillance" },
  { label: "Alerts", icon: "notifications", path: "/alerts", badge: 4 },
];

const NavLink = ({ item, isActive }) => (
  <Link
    to={item.path}
    className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all ${
      isActive
        ? "bg-blue-500/10 text-blue-500 font-semibold"
        : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
    }`}
  >
    <span className="material-symbols-outlined text-xl">{item.icon}</span>
    {item.label}
    {item.badge && (
      <span className="ml-auto bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
        {item.badge}
      </span>
    )}
  </Link>
);

const Sidebar = () => {
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const isReporter = user.role === "reporter";

  const mainMenu = isReporter
    ? [...commonMenu.slice(0, 1), ...reporterMenu, ...commonMenu.slice(1)]
    : commonMenu;

  return (
    <aside className="w-64 flex-shrink-0 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 hidden lg:flex flex-col">
      {/* Logo */}
      <div className="p-6 flex items-center gap-3">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center text-white">
            <span className="material-symbols-outlined">waves</span>
          </div>
          <span className="text-xl font-extrabold tracking-tight">NeerKavach</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto custom-scrollbar">
        <p className="px-3 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
          Main Menu
        </p>
        {mainMenu.map((item) => (
          <NavLink
            key={item.path}
            item={item}
            isActive={location.pathname === item.path}
          />
        ))}

        <div className="pt-6">
          <p className="px-3 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
            Health Authority
          </p>
          {authorityMenu.map((item) => (
            <NavLink
              key={item.path}
              item={item}
              isActive={location.pathname === item.path}
            />
          ))}
        </div>
      </nav>

      {/* Weekly Report */}
      <div className="p-4 mt-auto">
        <div className="bg-slate-100 dark:bg-slate-800/50 p-4 rounded-2xl">
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-1">
            Weekly Report
          </p>
          <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full mb-3">
            <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: "65%" }} />
          </div>
          <button className="w-full py-2 bg-white dark:bg-slate-700 text-xs font-bold rounded-lg shadow-sm border border-slate-200 dark:border-slate-600">
            Download PDF
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
