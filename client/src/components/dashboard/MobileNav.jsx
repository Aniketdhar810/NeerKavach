import React from "react";
import { Link, useLocation } from "react-router-dom";

const tabs = [
  { icon: "dashboard", path: "/dashboard" },
  { icon: "map", path: "/hotspot-map" },
  { icon: "description", path: "/my-reports" },
  { icon: "person", path: "/profile" },
];

const MobileNav = () => {
  const location = useLocation();

  return (
    <nav className="lg:hidden fixed bottom-6 left-4 right-4 bg-white/90 dark:bg-slate-900/90 glass-effect rounded-2xl border border-slate-200 dark:border-slate-700 h-16 shadow-2xl flex items-center justify-around px-4 z-50">
      {tabs.slice(0, 2).map((tab) => (
        <Link key={tab.path} to={tab.path}>
          <span
            className={`material-symbols-outlined ${
              location.pathname === tab.path
                ? "text-blue-500"
                : "text-slate-400"
            }`}
          >
            {tab.icon}
          </span>
        </Link>
      ))}

      {/* Center FAB */}
      <div className="relative -top-10">
        <Link
          to="/submit-test"
          className="w-14 h-14 bg-blue-500 text-white rounded-full shadow-lg shadow-blue-500/30 flex items-center justify-center border-4 border-slate-50 dark:border-slate-900"
        >
          <span className="material-symbols-outlined">add</span>
        </Link>
      </div>

      {tabs.slice(2).map((tab) => (
        <Link key={tab.path} to={tab.path}>
          <span
            className={`material-symbols-outlined ${
              location.pathname === tab.path
                ? "text-blue-500"
                : "text-slate-400"
            }`}
          >
            {tab.icon}
          </span>
        </Link>
      ))}
    </nav>
  );
};

export default MobileNav;
