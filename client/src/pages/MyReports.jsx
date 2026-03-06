import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import API from "../lib/api";

const riskBadge = {
  low: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400",
  moderate: "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400",
  high: "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400",
};

const statusBadge = {
  reviewed: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
  pending: "bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400",
};

const MyReports = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("all");
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  // Navigate to report detail
  const handleReportClick = (report) => {
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
            temperature: report.temperature,
            locationName: report.locationName,
            latitude: report.latitude,
            longitude: report.longitude,
          },
        },
      },
    });
  };

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        const endpoint = user.role === "reporter" ? "/reports/my" : "/reports";
        const res = await API.get(endpoint);
        setReports(res.data);
      } catch (error) {
        console.error("Failed to fetch reports:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  const filtered =
    filter === "all"
      ? reports
      : reports.filter((r) => r.prediction?.riskLevel === filter);

  const counts = {
    all: reports.length,
    high: reports.filter((r) => r.prediction?.riskLevel === "high").length,
    moderate: reports.filter((r) => r.prediction?.riskLevel === "moderate").length,
    low: reports.filter((r) => r.prediction?.riskLevel === "low").length,
  };

  return (
    <DashboardLayout>
      {loading && (
        <div className="flex items-center justify-center py-20">
          <span className="animate-spin material-symbols-outlined text-3xl text-blue-500">sync</span>
        </div>
      )}
      {!loading && (
        <>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">My Reports</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            View and manage your water quality test reports.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {JSON.parse(localStorage.getItem("user") || "{}").role === "reporter" && (
          <Link
            to="/submit-test"
            className="bg-blue-500 hover:bg-blue-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-lg shadow-blue-500/20 transition-all flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-sm">add</span>
            New Test
          </Link>
          )}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Reports", value: counts.all, icon: "description", color: "bg-slate-100 dark:bg-slate-700" },
          { label: "High Risk", value: counts.high, icon: "error", color: "bg-red-100 dark:bg-red-900/30 text-red-600" },
          { label: "Moderate", value: counts.moderate, icon: "warning", color: "bg-amber-100 dark:bg-amber-900/30 text-amber-600" },
          { label: "Low Risk", value: counts.low, icon: "check_circle", color: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600" },
        ].map((s) => (
          <div
            key={s.label}
            className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-100 dark:border-slate-700/50 shadow-sm"
          >
            <div className={`w-10 h-10 rounded-xl ${s.color} flex items-center justify-center mb-3`}>
              <span className="material-symbols-outlined">{s.icon}</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
              {s.label}
            </p>
            <p className="text-2xl font-extrabold mt-1">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        {["all", "high", "moderate", "low"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all capitalize ${
              filter === f
                ? "bg-blue-500 text-white shadow-lg shadow-blue-500/20"
                : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700"
            }`}
          >
            {f === "all" ? "All Reports" : `${f} Risk`}
          </button>
        ))}
      </div>

      {/* Reports Table */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700/50 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 dark:bg-slate-900/50 text-[10px] font-bold uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-6 py-4">Report ID</th>
                <th className="px-6 py-4">Location</th>
                <th className="px-6 py-4">pH</th>
                <th className="px-6 py-4">Turbidity</th>
                <th className="px-6 py-4">Risk</th>
                <th className="px-6 py-4">Disease</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50 text-sm">
              {filtered.map((r) => (
                <tr
                  key={r.reportId}
                  className="hover:bg-slate-50 dark:hover:bg-slate-900/30 transition-colors cursor-pointer"
                  onClick={() => handleReportClick(r)}
                >
                  <td className="px-6 py-4">
                    <span className="font-bold text-blue-500 text-xs">
                      {r.reportId}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-bold">{r.locationName}</span>
                      <span className="text-[10px] text-slate-400">
                        {r.waterSource}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium">{r.pH}</td>
                  <td className="px-6 py-4 font-medium text-slate-400">
                    {r.turbidity} NTU
                  </td>
                  <td className="px-6 py-4">
                    {r.prediction?.riskLevel ? (
                      <span
                        className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase ${riskBadge[r.prediction.riskLevel]}`}
                      >
                        {r.prediction.riskPercent}% {r.prediction.riskLevel}
                      </span>
                    ) : (
                      <span className="text-xs text-slate-400">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-xs font-medium">
                    {r.prediction?.diseases?.length
                      ? r.prediction.diseases.sort((a, b) => b.probability - a.probability)[0].name
                      : "—"}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase ${statusBadge[r.status]}`}
                    >
                      {r.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-400">
                    {new Date(r.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={(e) => { e.stopPropagation(); handleReportClick(r); }}
                      className="text-blue-500 hover:text-blue-600 transition-colors"
                    >
                      <span className="material-symbols-outlined text-lg">
                        arrow_forward
                      </span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="p-12 text-center">
            <span className="material-symbols-outlined text-4xl text-slate-300 dark:text-slate-600 mb-2">
              description
            </span>
            <p className="text-sm text-slate-400">
              No reports found for this filter.
            </p>
          </div>
        )}
      </div>
        </>
      )}
    </DashboardLayout>
  );
};

export default MyReports;
