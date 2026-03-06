import React, { useState, useEffect } from "react";
import API from "../../lib/api";

const RiskDistribution = () => {
  const [stats, setStats] = useState({
    lowPercent: 0,
    moderatePercent: 0,
    highPercent: 0,
    safeAverage: 0,
    totalReports: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDistribution = async () => {
      try {
        setLoading(true);
        // Try user's reports first, then all reports
        let response;
        try {
          response = await API.get("/reports/my");
        } catch {
          response = await API.get("/reports");
        }
        const reports = response.data || [];
        console.log("Risk Distribution - Reports:", reports);

        // Only count reports that have predictions
        const reportsWithPrediction = reports.filter(r => r.prediction && r.prediction.riskLevel);
        const total = reportsWithPrediction.length;
        
        let lowRisk = 0;
        let moderateRisk = 0;
        let highRisk = 0;

        reportsWithPrediction.forEach((report) => {
          const riskLevel = report.prediction.riskLevel;
          if (riskLevel === "low") lowRisk++;
          else if (riskLevel === "moderate") moderateRisk++;
          else if (riskLevel === "high") highRisk++;
        });

        if (total > 0) {
          const lowPercent = Math.round((lowRisk / total) * 100);
          const moderatePercent = Math.round((moderateRisk / total) * 100);
          const highPercent = Math.round((highRisk / total) * 100);

          // Safe average calculation
          const safeAverage = Math.round(lowPercent + (moderatePercent * 0.5));

          setStats({
            lowPercent: lowPercent || 0,
            moderatePercent: moderatePercent || 0,
            highPercent: highPercent || 0,
            safeAverage: Math.min(safeAverage, 100),
            totalReports: total,
          });
        } else {
          // No reports with predictions
          setStats({
            lowPercent: 0,
            moderatePercent: 0,
            highPercent: 0,
            safeAverage: 0,
            totalReports: 0,
          });
        }
      } catch (error) {
        console.error("Failed to fetch distribution:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDistribution();
  }, []);

  const legend = [
    { label: "Low Risk Area", color: "bg-emerald-500", value: `${stats.lowPercent}%` },
    { label: "Moderate Concern", color: "bg-amber-500", value: `${stats.moderatePercent}%` },
    { label: "High Risk Hotspot", color: "bg-red-500", value: `${stats.highPercent}%` },
  ];

  // Calculate SVG stroke offsets for donut chart
  // circumference = 2 * π * r = 2 * 3.14159 * 80 ≈ 502.65
  const circumference = 502;
  const hasData = stats.totalReports > 0;
  const highOffset = circumference - (stats.highPercent / 100) * circumference;
  const moderateOffset = circumference - ((stats.highPercent + stats.moderatePercent) / 100) * circumference;
  const lowOffset = circumference - ((stats.highPercent + stats.moderatePercent + stats.lowPercent) / 100) * circumference;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700/50 shadow-sm p-6 flex flex-col items-center justify-between">
      <div className="w-full mb-4">
        <h2 className="text-lg font-bold">Risk Distribution</h2>
        <p className="text-xs text-slate-400 mt-1">
          {hasData ? `Based on ${stats.totalReports} reports` : "Submit reports to see analysis"}
        </p>
      </div>

      {/* Donut Chart */}
      <div className="relative w-48 h-48 flex items-center justify-center">
        {loading ? (
          <div className="animate-pulse bg-slate-200 dark:bg-slate-700 rounded-full w-full h-full" />
        ) : !hasData ? (
          <>
            <svg className="w-full h-full -rotate-90" viewBox="0 0 192 192">
              <circle
                cx="96"
                cy="96"
                r="80"
                fill="transparent"
                stroke="currentColor"
                strokeWidth="20"
                className="text-slate-100 dark:text-slate-700"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="material-symbols-outlined text-3xl text-slate-300">analytics</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                No Data
              </span>
            </div>
          </>
        ) : (
          <>
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
              {/* Red segment (High Risk) */}
              <circle
                cx="96"
                cy="96"
                r="80"
                fill="transparent"
                stroke="currentColor"
                strokeWidth="20"
                strokeDasharray={circumference}
                strokeDashoffset={highOffset}
                strokeLinecap="round"
                className="text-red-500"
              />
              {/* Amber segment (Moderate Risk) - includes high offset */}
              <circle
                cx="96"
                cy="96"
                r="80"
                fill="transparent"
                stroke="currentColor"
                strokeWidth="20"
                strokeDasharray={circumference}
                strokeDashoffset={moderateOffset}
                strokeLinecap="round"
                className="text-amber-500"
              />
              {/* Green segment (Low Risk) - includes both */}
              <circle
                cx="96"
                cy="96"
                r="80"
                fill="transparent"
                stroke="currentColor"
                strokeWidth="20"
                strokeDasharray={circumference}
                strokeDashoffset={lowOffset}
                strokeLinecap="round"
                className="text-emerald-500"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-3xl font-extrabold">{stats.safeAverage}%</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Safe Avg
              </span>
            </div>
          </>
        )}
      </div>
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
