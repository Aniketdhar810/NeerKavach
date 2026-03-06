import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../lib/api";

const SurveillanceInsight = () => {
  const navigate = useNavigate();
  const [insight, setInsight] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const analyzeReports = async () => {
      try {
        setLoading(true);
        const response = await API.get("/reports");
        const reports = response.data || [];

        // Find high risk reports
        const highRiskReports = reports.filter(
          (r) => r.prediction?.riskLevel === "high"
        );

        if (highRiskReports.length > 0) {
          // Find the most recent high-risk report
          const latestHighRisk = highRiskReports[0];
          const diseases = latestHighRisk.prediction?.diseases || [];
          const maxDisease = diseases.reduce(
            (max, d) => (d.probability > (max?.probability || 0) ? d : max),
            null
          );

          setInsight({
            type: "outbreak",
            location: latestHighRisk.locationName || "Unknown Location",
            waterSource: latestHighRisk.waterSource,
            disease: maxDisease?.name || "waterborne illness",
            probability: Math.round(maxDisease?.probability || 0),
            reportCount: highRiskReports.length,
            recommendation: "Initiating preemptive intervention protocols recommended.",
          });
        } else if (reports.length > 0) {
          // General insight when no high risk
          const moderateRisk = reports.filter(
            (r) => r.prediction?.riskLevel === "moderate"
          );
          setInsight({
            type: "monitoring",
            location: "All Monitored Regions",
            reportCount: reports.length,
            moderateCount: moderateRisk.length,
            recommendation: "Continue regular monitoring. No immediate action required.",
          });
        } else {
          setInsight(null);
        }
      } catch (error) {
        console.error("Failed to analyze reports:", error);
      } finally {
        setLoading(false);
      }
    };

    analyzeReports();
  }, []);

  if (dismissed || loading || !insight) {
    return null;
  }

  const isOutbreak = insight.type === "outbreak";

  return (
    <div
      className={`${
        isOutbreak
          ? "bg-rose-50/50 dark:bg-rose-900/10 border-rose-200/50 dark:border-rose-800/30"
          : "bg-blue-500/5 dark:bg-blue-500/10 border-blue-500/10"
      } rounded-2xl p-6 border flex flex-col lg:flex-row lg:items-center gap-8`}
    >
      <div className="flex-1">
        <div
          className={`flex items-center gap-2 ${
            isOutbreak ? "text-rose-500" : "text-blue-500"
          } mb-2`}
        >
          <span className="material-symbols-outlined text-lg">
            {isOutbreak ? "warning" : "auto_awesome"}
          </span>
          <span className="text-xs font-extrabold uppercase tracking-widest">
            {isOutbreak ? "Alert" : "Surveillance Insight"}
          </span>
        </div>
        <h3 className="text-xl font-bold mb-2">
          {isOutbreak
            ? `High Risk Detected in ${insight.location}`
            : `Monitoring ${insight.reportCount} Reports`}
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          {isOutbreak
            ? `${insight.reportCount} high-risk report(s) detected. ${insight.probability}% likelihood of ${insight.disease} outbreak based on water quality from ${insight.waterSource}. ${insight.recommendation}`
            : `${insight.moderateCount} moderate risk areas identified. ${insight.recommendation}`}
        </p>
      </div>
      <div className="flex gap-4">
        <button
          onClick={() => setDismissed(true)}
          className="bg-white dark:bg-slate-800 px-6 py-3 rounded-xl font-bold text-xs shadow-sm whitespace-nowrap hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
        >
          Dismiss
        </button>
        <button
          onClick={() => navigate("/hotspot-map")}
          className={`${
            isOutbreak ? "bg-rose-500" : "bg-blue-500"
          } text-white px-6 py-3 rounded-xl font-bold text-xs shadow-lg ${
            isOutbreak ? "shadow-rose-500/20" : "shadow-blue-500/20"
          } whitespace-nowrap hover:opacity-90 transition-opacity`}
        >
          {isOutbreak ? "View Hotspots" : "View Map"}
        </button>
      </div>
    </div>
  );
};

export default SurveillanceInsight;
