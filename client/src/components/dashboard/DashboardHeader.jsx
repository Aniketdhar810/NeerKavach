import React from "react";
import ThemeToggle from "../ThemeToggle";

const DashboardHeader = ({ darkMode, onToggleTheme }) => {
  return (
    <header className="h-16 lg:h-20 bg-white/80 dark:bg-slate-900/80 glass-effect border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 lg:px-8 z-20">
      {/* Left */}
      <div className="flex items-center gap-4 flex-1">
        <button className="lg:hidden text-slate-600 dark:text-slate-400">
          <span className="material-symbols-outlined">menu</span>
        </button>

        <div className="relative w-full max-w-md hidden md:block">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl">
            search
          </span>
          <input
            className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-2xl py-2 pl-10 pr-4 focus:ring-2 focus:ring-blue-500/20 text-sm"
            placeholder="Search data points, locations..."
          />
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-3 lg:gap-6">
        <ThemeToggle darkMode={darkMode} onToggle={onToggleTheme} />

        {/* Notifications */}
        <button className="relative p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
          <span className="material-symbols-outlined">notifications</span>
          <span className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full"></span>
        </button>

        <div className="h-8 w-[1px] bg-slate-200 dark:bg-slate-700 mx-1 hidden sm:block" />

        {/* User */}
        <div className="flex items-center gap-3 cursor-pointer group">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-bold leading-tight">Dr. Aditi Sharma</p>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
              Regional Health Admin
            </p>
          </div>
          <img
            alt="User Profile"
            className="w-10 h-10 rounded-xl bg-slate-100 group-hover:ring-2 ring-blue-500/20 transition-all"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDs0xFd8Owl0JFEG9u322uuL-pluJUlm0EO8Wf5fpOvCV_EFpGs_dl4ZI5sFiR6Y9pb6tbslkCLTWG74BjgH41DgYLf9fz6fkyHc55yVKR7k1Rto2kHDFzcMUSt4SDH9pM9KlOWnfIbQNwnwGrgvOvL2-ouWVtmDTY5Fb-0PmFJ5xgiXHc0y3RmoJ0ZRG9tA2PO3gvo2ENSudUitwNF3p3-gpQ5uLct0BQO5P8Fdyj6YOl6LG4Tb5VuBNU34h32v6QnY76Ig6ESIN3d"
          />
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
