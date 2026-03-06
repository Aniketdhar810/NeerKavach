import React from "react";

const stats = [
  {
    label: "Total Tests",
    value: "1,284",
    icon: "science",
    trend: "+12%",
    trendUp: true,
    iconBg: "bg-slate-100 dark:bg-slate-700",
    iconHover: "group-hover:bg-blue-500/10 group-hover:text-blue-500",
    trendColor: "text-emerald-500",
  },
  {
    label: "Low Risk",
    value: "842",
    icon: "check_circle",
    trend: "+5%",
    trendUp: true,
    iconBg: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600",
    iconHover: "",
    trendColor: "text-emerald-500",
  },
  {
    label: "Moderate Risk",
    value: "315",
    icon: "warning",
    trend: "-2%",
    trendUp: false,
    iconBg: "bg-amber-100 dark:bg-amber-900/30 text-amber-600",
    iconHover: "",
    trendColor: "text-red-500",
  },
  {
    label: "High Risk",
    value: "127",
    icon: "error",
    trend: "+8%",
    trendUp: true,
    iconBg: "bg-red-100 dark:bg-red-900/30 text-red-600",
    iconHover: "",
    trendColor: "text-red-500",
  },
];

const StatsGrid = () => {
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
          <p className="text-3xl font-extrabold mt-1">{stat.value}</p>
        </div>
      ))}
    </div>
  );
};

export default StatsGrid;
