import React from "react";

const ThemeToggle = ({ darkMode, onToggle }) => {
  return (
    <button
      onClick={onToggle}
      className="w-10 h-10 flex items-center justify-center rounded-full bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
    >
      {darkMode ? (
        <span className="material-symbols-outlined text-xl">light_mode</span>
      ) : (
        <span className="material-symbols-outlined text-xl">dark_mode</span>
      )}
    </button>
  );
};

export default ThemeToggle;
