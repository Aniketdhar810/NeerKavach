import React from "react";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import WaterTestSummary from "../components/prediction/WaterTestSummary";
import RiskMatrix from "../components/prediction/RiskMatrix";
import RecommendedActions from "../components/prediction/RecommendedActions";

const PredictionResult = () => {
  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <nav className="flex items-center gap-2 text-sm text-slate-500 mb-2">
            <span>Surveillance</span>
            <span className="material-symbols-outlined text-xs">
              chevron_right
            </span>
            <span>Analysis</span>
            <span className="material-symbols-outlined text-xs">
              chevron_right
            </span>
            <span className="text-blue-500 font-medium">Results</span>
          </nav>
          <h1 className="text-3xl font-bold">
            Disease Risk Prediction Results
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Report ID: WQ-IND-2024-892 • Collected: Oct 24, 2024
          </p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
            <span className="material-symbols-outlined text-sm">download</span>
            <span>Export PDF</span>
          </button>
          <button className="flex items-center gap-2 px-6 py-2 rounded-xl bg-blue-500 text-white font-semibold hover:opacity-90 transition-opacity">
            <span className="material-symbols-outlined text-sm">share</span>
            <span>Dispatch Alert</span>
          </button>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column — Test Summary */}
        <div className="lg:col-span-4">
          <WaterTestSummary />
        </div>

        {/* Right Column — Risk + Actions */}
        <div className="lg:col-span-8 space-y-8">
          <RiskMatrix />
          <RecommendedActions />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PredictionResult;
