import React from "react";

const SurveillanceInsight = () => {
  return (
    <div className="bg-blue-500/5 dark:bg-blue-500/10 rounded-2xl p-6 border border-blue-500/10 flex flex-col lg:flex-row lg:items-center gap-8">
      <div className="flex-1">
        <div className="flex items-center gap-2 text-blue-500 mb-2">
          <span className="material-symbols-outlined text-lg">
            auto_awesome
          </span>
          <span className="text-xs font-extrabold uppercase tracking-widest">
            Surveillance Insight
          </span>
        </div>
        <h3 className="text-xl font-bold mb-2">
          Potential outbreak detected in Mysuru District.
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          Based on current bacterial trends, there's a 35% increased risk of
          water-borne illness in Zone B-4 over the next 14 days. Suggesting
          preemptive chlorination check.
        </p>
      </div>
      <div className="flex gap-4">
        <button className="bg-white dark:bg-slate-800 px-6 py-3 rounded-xl font-bold text-xs shadow-sm whitespace-nowrap">
          Dismiss
        </button>
        <button className="bg-blue-500 text-white px-6 py-3 rounded-xl font-bold text-xs shadow-lg shadow-blue-500/20 whitespace-nowrap">
          Action Protocol
        </button>
      </div>
    </div>
  );
};

export default SurveillanceInsight;
