import React from "react";

const legend = [
  { label: "Low Risk Area", color: "bg-emerald-500", value: "65%" },
  { label: "Moderate Concern", color: "bg-amber-500", value: "25%" },
  { label: "High Risk Hotspot", color: "bg-red-500", value: "10%" },
];

const RiskDistribution = () => {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700/50 shadow-sm p-6 flex flex-col items-center justify-between">
      <div className="w-full mb-4">
        <h2 className="text-lg font-bold">Risk Distribution</h2>
        <p className="text-xs text-slate-400 mt-1">
          AI-based disease risk forecast
        </p>
      </div>

      {/* Donut Chart */}
      <div className="relative w-48 h-48 flex items-center justify-center">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 192 192">
          {/* Background ring */}
          <circle
            cx="96"
            cy="96"
            r="80"
            fill="transparent"
            stroke="currentColor"
            strokeWidth="20"
            className="text-slate-100 dark:text-slate-700"
          />
          {/* Red segment */}
          <circle
            cx="96"
            cy="96"
            r="80"
            fill="transparent"
            stroke="currentColor"
            strokeWidth="20"
            strokeDasharray="502"
            strokeDashoffset="440"
            strokeLinecap="round"
            className="text-red-500"
          />
          {/* Amber segment */}
          <circle
            cx="96"
            cy="96"
            r="80"
            fill="transparent"
            stroke="currentColor"
            strokeWidth="20"
            strokeDasharray="502"
            strokeDashoffset="350"
            strokeLinecap="round"
            className="text-amber-500"
          />
          {/* Green segment */}
          <circle
            cx="96"
            cy="96"
            r="80"
            fill="transparent"
            stroke="currentColor"
            strokeWidth="20"
            strokeDasharray="502"
            strokeDashoffset="150"
            strokeLinecap="round"
            className="text-emerald-500"
          />
        </svg>
        <div className="absolute flex flex-col items-center justify-center">
          <span className="text-3xl font-extrabold">82%</span>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Safe Avg
          </span>
        </div>
      </div>

      {/* Legend */}
      <div className="w-full mt-6 space-y-3">
        {legend.map((item) => (
          <div key={item.label} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className={`w-3 h-3 rounded-full ${item.color}`} />
              <span className="text-xs font-medium">{item.label}</span>
            </div>
            <span className="text-xs font-bold">{item.value}</span>
          </div>
        ))}
      </div>

      <button className="w-full mt-6 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
        Detailed Analytics
      </button>
    </div>
  );
};

export default RiskDistribution;
