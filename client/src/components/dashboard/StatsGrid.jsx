import React, { useState, useEffect } from "react";
import API from "../../lib/api";

const defaultStats = [
  {
    label: "Total Tests",
    value: "0",
    icon: "science",
    trend: "0%",
    trendUp: true,
    iconBg: "bg-slate-100 dark:bg-slate-700",
    iconHover: "group-hover:bg-blue-500/10 group-hover:text-blue-500",
    trendColor: "text-slate-400",
  },
  {
    label: "Low Risk",
    value: "0",
    icon: "check_circle",
    trend: "0%",
    trendUp: true,
    iconBg: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600",
    iconHover: "",
    trendColor: "text-emerald-500",
  },
  {
    label: "Moderate Risk",
    value: "0",
    icon: "warning",
    trend: "0%",
    trendUp: false,
    iconBg: "bg-amber-100 dark:bg-amber-900/30 text-amber-600",
    iconHover: "",
    trendColor: "text-amber-500",
  },
  {
    label: "High Risk",
    value: "0",
    icon: "error",
    trend: "0%",
    trendUp: true,
    iconBg: "bg-red-100 dark:bg-red-900/30 text-red-600",
    iconHover: "",
    trendColor: "text-red-500",
  },
];

const StatsGrid = () => {
  const [stats, setStats] = useState(defaultStats);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await API.get("/reports");
        const reports = response.data || [];

        // Calculate stats from real data
        const total = reports.length;
        let lowRisk = 0;
        let moderateRisk = 0;
        let highRisk = 0;

        reports.forEach((report) => {
          const riskLevel = report.prediction?.riskLevel;
          if (riskLevel === "low") lowRisk++;
          else if (riskLevel === "moderate") moderateRisk++;
          else if (riskLevel === "high") highRisk++;
        });

        // Calculate percentages
        const lowPercent = total > 0 ? Math.round((lowRisk / total) * 100) : 0;
        const modPercent = total > 0 ? Math.round((moderateRisk / total) * 100) : 0;
        const highPercent = total > 0 ? Math.round((highRisk / total) * 100) : 0;

        setStats([
          {
            ...defaultStats[0],
            value: total.toLocaleString(),
            trend: `${total > 0 ? "+" : ""}${total}`,
            trendUp: total > 0,
            trendColor: total > 0 ? "text-emerald-500" : "text-slate-400",
          },
          {
            ...defaultStats[1],
            value: lowRisk.toLocaleString(),
            trend: `${lowPercent}%`,
            trendUp: lowPercent >= 50,
            trendColor: "text-emerald-500",
          },
          {
            ...defaultStats[2],
            value: moderateRisk.toLocaleString(),
            trend: `${modPercent}%`,
            trendUp: modPercent < 30,
            trendColor: modPercent > 30 ? "text-amber-500" : "text-emerald-500",
          },
          {
            ...defaultStats[3],
            value: highRisk.toLocaleString(),
            trend: `${highPercent}%`,
            trendUp: highPercent > 10,
            trendColor: highPercent > 20 ? "text-red-500" : "text-amber-500",
          },
        ]);
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700/50 shadow-sm group hover:shadow-md transition-all"
        >
          <div className="flex justify-between items-start mb-4">
            <div
              className={`p-2.5 rounded-xl transition-colors ${stat.iconBg} ${stat.iconHover}`}
            >
              <span className="material-symbols-outlined">{stat.icon}</span>
            </div>
            <span
              className={`text-xs font-bold flex items-center ${stat.trendColor}`}
            >
              {stat.trend}
              <span className="material-symbols-outlined text-xs ml-0.5">
                {stat.trendUp ? "trending_up" : "trending_down"}
              </span>
            </span>
          </div>
          <h3 className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">
            {stat.label}
          </h3>
          <p className="text-3xl font-extrabold mt-1">
            {loading ? (
              <span className="animate-pulse bg-slate-200 dark:bg-slate-700 rounded h-9 w-16 inline-block" />
            ) : (
              stat.value
            )}
          </p>
        </div>
      ))}
    </div>
  );
};

export default StatsGrid;
