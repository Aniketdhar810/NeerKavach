import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../lib/api";

const riskStyles = {
  low: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400",
  moderate: "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400",
  high: "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400",
};

const RecentReports = () => {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        // Try /reports/my first for user's reports, fallback to all reports
        let response;
        try {
          response = await API.get("/reports/my");
        } catch {
          response = await API.get("/reports");
        }
        // Get only the 5 most recent reports
        const latestReports = (response.data || []).slice(0, 5);
        console.log("Fetched reports:", latestReports);
        setReports(latestReports);
      } catch (error) {
        console.error("Failed to fetch reports:", error);
        setReports([]);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getRiskDisplay = (prediction) => {
    if (!prediction) return { text: "Pending", level: "moderate" };
    const percent = Math.round(prediction.riskPercent || 0);
    const level = prediction.riskLevel || "low";
    const levelText = level === "low" ? "Low" : level === "moderate" ? "Med" : "High";
    return { text: `${percent}% ${levelText}`, level };
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700/50 shadow-sm flex flex-col">
      <div className="p-6 border-b border-slate-100 dark:border-slate-700/50 flex items-center justify-between">
        <h2 className="text-lg font-bold">Recent Reports</h2>
        <button
          onClick={() => navigate("/my-reports")}
          className="text-xs font-bold text-blue-500 hover:underline"
        >
          View All
        </button>
      </div>
      <div className="overflow-x-auto">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
            <p className="text-sm text-slate-400 mt-2">Loading reports...</p>
          </div>
        ) : reports.length === 0 ? (
          <div className="p-8 text-center">
            <span className="material-symbols-outlined text-4xl text-slate-300 mb-2">
              description
            </span>
            <p className="text-sm text-slate-400">No reports yet</p>
          </div>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-slate-50 dark:bg-slate-900/50 text-[10px] font-bold uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-6 py-4">Location</th>
                <th className="px-6 py-4">pH</th>
                <th className="px-6 py-4">Turbidity</th>
                <th className="px-6 py-4">Bacteria</th>
                <th className="px-6 py-4">Risk %</th>
                <th className="px-6 py-4">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50 text-sm">
              {reports.map((report, i) => {
                const risk = getRiskDisplay(report.prediction);
                return (
                  <tr
                    key={report._id || i}
                    className="hover:bg-slate-50 dark:hover:bg-slate-900/30 transition-colors cursor-pointer"
                    onClick={() =>
                      navigate("/prediction-result", {
                        state: {
                          reportId: report.reportId,
                          prediction: {
                            prediction: report.prediction,
                            waterTestSummary: {
                              waterSource: report.waterSource,
                              pH: report.pH,
                              turbidity: report.turbidity,
                              dissolvedOxygen: report.dissolvedOxygen,
                              nitrateLevel: report.nitrateLevel,
                              contaminantLevel: report.contaminantLevel,
                              bacteriaCount: report.bacteriaCount,
                              fecalColiform: report.fecalColiform,
                              totalColiform: report.totalColiform,
                              locationName: report.locationName,
                              latitude: report.latitude,
                              longitude: report.longitude,
                            },
                          },
                        },
                      })
                    }
                  >
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-bold">{report.locationName}</span>
                        <span className="text-[10px] text-slate-400">
                          {report.waterSource}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium">
                      {report.pH?.toFixed(1) || "N/A"}
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-400">
                      {report.turbidity?.toFixed(1) || "N/A"} NTU
                    </td>
                    <td className="px-6 py-4 font-medium">
                      {report.bacteriaCount?.toLocaleString() || "N/A"} CFU
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase ${riskStyles[risk.level]}`}
                      >
                        {risk.text}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-400">
                      {formatDate(report.createdAt)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default RecentReports;
