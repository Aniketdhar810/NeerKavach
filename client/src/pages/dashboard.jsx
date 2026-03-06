import React from "react";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import StatsGrid from "../components/dashboard/StatsGrid";
import RecentReports from "../components/dashboard/RecentReports";
import RiskDistribution from "../components/dashboard/RiskDistribution";
import SurveillanceInsight from "../components/dashboard/SurveillanceInsight";

function Dashboard() {
  return (
    <DashboardLayout>
      {/* Title + Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">
            Health Surveillance Dashboard
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Monitoring water quality risk levels across Karnataka State.
          </p>
        </div>
        <div className="flex items-center bg-white dark:bg-slate-800 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <span className="material-symbols-outlined text-sm mr-2 text-slate-400">
            calendar_today
          </span>
          <span className="text-xs font-bold">
            {new Date().toLocaleDateString("en-US", {
              weekday: "short",
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </span>
        </div>
      </div>

      {/* Stats */}
      <StatsGrid />

      {/* Reports + Risk Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        <div className="lg:col-span-2">
          <RecentReports />
        </div>
        <RiskDistribution />
      </div>

      {/* AI Insight */}
      <SurveillanceInsight />
    </DashboardLayout>
  );
}

export default Dashboard;