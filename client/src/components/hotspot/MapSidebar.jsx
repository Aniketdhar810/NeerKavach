import React from "react";

const diseases = [
  { label: "All Diseases", checked: true },
  { label: "Cholera", color: "bg-red-500" },
  { label: "Typhoid", color: "bg-amber-500" },
  { label: "Diarrhea", color: "bg-emerald-500" },
];

const periods = [
  "Current Week (Live)",
  "Last 30 Days",
  "Last 90 Days",
  "Monsoon Season (2024)",
];

const MapSidebar = ({ filters, onFilterChange }) => {
  return (
    <aside className="w-80 flex-shrink-0 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 flex flex-col gap-8 overflow-y-auto custom-scrollbar hidden lg:flex">
      {/* Header + Search */}
      <div>
        <h2 className="text-lg font-bold mb-4">Risk Surveillance</h2>
        <div className="relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
            search
          </span>
          <input
            className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border-transparent rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Search District or State..."
            type="text"
          />
        </div>
      </div>

      {/* Disease Focus */}
      <section>
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
          Disease Focus
        </h3>
        <div className="space-y-2">
          {diseases.map((d) => (
            <label
              key={d.label}
              className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 dark:border-slate-800 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all"
            >
              <input
                defaultChecked={d.checked}
                className="rounded text-blue-600 focus:ring-blue-500"
                type="checkbox"
              />
              <span className="text-sm font-medium">{d.label}</span>
              {d.color && (
                <span
                  className={`ml-auto w-2 h-2 rounded-full ${d.color}`}
                />
              )}
            </label>
          ))}
        </div>
      </section>

      {/* Surveillance Period */}
      <section>
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
          Surveillance Period
        </h3>
        <select className="w-full bg-slate-100 dark:bg-slate-800 border-transparent rounded-lg text-sm focus:ring-2 focus:ring-blue-500">
          {periods.map((p) => (
            <option key={p}>{p}</option>
          ))}
        </select>
      </section>

      {/* Stats */}
      <section className="mt-auto pt-6 border-t border-slate-200 dark:border-slate-800">
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
            <p className="text-xs text-slate-500 mb-1">Total Hotspots</p>
            <p className="text-2xl font-bold">142</p>
          </div>
          <div className="p-4 bg-red-50 dark:bg-red-900/10 rounded-2xl border border-red-100 dark:border-red-900/30">
            <p className="text-xs text-red-600 dark:text-red-400 mb-1">
              High Risk
            </p>
            <p className="text-2xl font-bold text-red-600 dark:text-red-400">
              12
            </p>
          </div>
        </div>
      </section>
    </aside>
  );
};

export default MapSidebar;
