import React from "react";
import { Link } from "react-router-dom";

const HotspotPopup = ({ hotspot, onClose }) => {
  if (!hotspot) return null;

  return (
    <div className="absolute z-30 w-[340px] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in duration-300"
      style={{ top: hotspot.popupY, left: hotspot.popupX, transform: "translate(-50%, 12px)" }}
    >
      {/* Header */}
      <div className="p-4 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between border-b border-slate-200 dark:border-slate-800">
        <div>
          <h4 className="font-bold text-slate-900 dark:text-white">
            {hotspot.district}
          </h4>
          <p className="text-xs text-slate-500">{hotspot.region}</p>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`px-2.5 py-1 text-[10px] font-bold rounded-full uppercase border ${
              hotspot.riskLevel === "high"
                ? "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800/50"
                : hotspot.riskLevel === "moderate"
                ? "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800/50"
                : "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/50"
            }`}
          >
            {hotspot.riskLevel === "high"
              ? "High Risk"
              : hotspot.riskLevel === "moderate"
              ? "Moderate"
              : "Low Risk"}
          </span>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            <span className="material-symbols-outlined text-sm text-slate-400">
              close
            </span>
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="p-5">
        {/* Quick stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
              <span className="material-symbols-outlined text-blue-500 text-lg">
                science
              </span>
            </div>
            <div>
              <p className="text-[10px] text-slate-500 font-medium">Water pH</p>
              <p className="text-sm font-bold">
                {hotspot.ph}{" "}
                {hotspot.phNote && (
                  <span className="text-[10px] font-normal text-red-500">
                    ({hotspot.phNote})
                  </span>
                )}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center">
              <span className="material-symbols-outlined text-orange-500 text-lg">
                opacity
              </span>
            </div>
            <div>
              <p className="text-[10px] text-slate-500 font-medium">
                Turbidity
              </p>
              <p className="text-sm font-bold">{hotspot.turbidity} NTU</p>
            </div>
          </div>
        </div>

        {/* Disease Probabilities */}
        <div className="space-y-4">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
            Disease Probabilities
          </p>
          {hotspot.diseases.map((d) => (
            <div key={d.name}>
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-xs font-semibold">{d.name}</span>
                <span className={`text-xs font-bold ${d.color}`}>
                  {d.probability}%
                </span>
              </div>
              <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${d.barColor}`}
                  style={{ width: `${d.probability}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        <Link
          to="/prediction-result"
          className="w-full mt-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-all flex items-center justify-center gap-2 group"
        >
          View Detailed Surveillance Report
          <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">
            arrow_forward
          </span>
        </Link>
      </div>
    </div>
  );
};

export default HotspotPopup;
