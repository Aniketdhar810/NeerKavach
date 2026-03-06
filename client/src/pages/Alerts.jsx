import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import API from "../lib/api";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
};

// Extract state from location string
const extractState = (location) => {
  if (!location) return null;
  
  const INDIAN_STATES = {
    "andhra pradesh": "Andhra Pradesh",
    "arunachal pradesh": "Arunachal Pradesh",
    "assam": "Assam",
    "bihar": "Bihar",
    "chhattisgarh": "Chhattisgarh",
    "goa": "Goa",
    "gujarat": "Gujarat",
    "haryana": "Haryana",
    "himachal pradesh": "Himachal Pradesh",
    "jharkhand": "Jharkhand",
    "jahrkhand": "Jharkhand",
    "jharkhnad": "Jharkhand",
    "karnataka": "Karnataka",
    "kerala": "Kerala",
    "madhya pradesh": "Madhya Pradesh",
    "maharashtra": "Maharashtra",
    "manipur": "Manipur",
    "meghalaya": "Meghalaya",
    "mizoram": "Mizoram",
    "nagaland": "Nagaland",
    "odisha": "Odisha",
    "orissa": "Odisha",
    "punjab": "Punjab",
    "rajasthan": "Rajasthan",
    "sikkim": "Sikkim",
    "tamil nadu": "Tamil Nadu",
    "tamilnadu": "Tamil Nadu",
    "telangana": "Telangana",
    "tripura": "Tripura",
    "uttar pradesh": "Uttar Pradesh",
    "uttarakhand": "Uttarakhand",
    "west bengal": "West Bengal",
    "delhi": "Delhi",
    "new delhi": "Delhi",
  };

  const locationLower = location.toLowerCase();
  for (const [key, value] of Object.entries(INDIAN_STATES)) {
    if (locationLower.includes(key)) {
      return value;
    }
  }
  return null;
};

function Alerts() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userState, setUserState] = useState(null);
  const [sending, setSending] = useState(false);
  const [emailStatus, setEmailStatus] = useState(null);

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    try {
      setLoading(true);
      
      // Get user's region from localStorage
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const userRegion = user.region || "";
      const extractedState = extractState(userRegion);
      setUserState(extractedState);

      // Fetch all reports
      const res = await API.get("/reports");
      const allReports = res.data || [];

      // Filter reports that have high risk (>= 40%) and are in the same state
      const alertReports = allReports.filter(report => {
        const riskPercent = report.prediction?.riskPercent || 0;
        if (riskPercent < 40) return false;
        
        // Check if report is in user's state
        const reportState = extractState(report.locationName);
        if (extractedState && reportState) {
          return reportState === extractedState;
        }
        // If we can't determine state, show all high risk reports
        return true;
      });

      // Sort by risk (highest first) and date (newest first)
      alertReports.sort((a, b) => {
        const riskDiff = (b.prediction?.riskPercent || 0) - (a.prediction?.riskPercent || 0);
        if (riskDiff !== 0) return riskDiff;
        return new Date(b.createdAt) - new Date(a.createdAt);
      });

      setAlerts(alertReports);
    } catch (error) {
      console.error("Error fetching alerts:", error);
    } finally {
      setLoading(false);
    }
  };

  const sendEmailAlert = async (report) => {
    try {
      setSending(true);
      setEmailStatus(null);
      
      const res = await API.post(`/prediction/test/trigger-alerts/${report.reportId}`);
      setEmailStatus({ 
        type: "success", 
        message: `Alert sent! ${res.data.message || "Users in this region have been notified."}`,
        details: res.data
      });
    } catch (error) {
      console.error("Error sending alert:", error);
      setEmailStatus({ 
        type: "error", 
        message: error.response?.data?.message || "Failed to send email alert" 
      });
    } finally {
      setSending(false);
    }
  };

  const getRiskColor = (percent) => {
    if (percent >= 60) return "text-red-500 bg-red-50 dark:bg-red-900/20";
    if (percent >= 40) return "text-orange-500 bg-orange-50 dark:bg-orange-900/20";
    return "text-green-500 bg-green-50 dark:bg-green-900/20";
  };

  const getRiskBadge = (level) => {
    const styles = {
      high: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
      moderate: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
      low: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    };
    return styles[level] || styles.low;
  };

  return (
    <DashboardLayout>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight flex items-center gap-2">
            <span className="material-symbols-outlined text-orange-500">notifications_active</span>
            Water Quality Alerts
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {userState ? (
              <>High-risk water reports in <span className="font-semibold text-blue-500">{userState}</span></>
            ) : (
              "High-risk water reports requiring attention"
            )}
          </p>
        </div>
        <button
          onClick={fetchAlerts}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-colors text-sm font-bold"
        >
          <span className="material-symbols-outlined text-sm">refresh</span>
          Refresh
        </button>
      </motion.div>

      {/* Email Status Banner */}
      <AnimatePresence>
      {emailStatus && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className={`mb-6 p-4 rounded-xl flex items-start gap-3 ${
          emailStatus.type === "success" 
            ? "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800" 
            : "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
        }`}>
          <span className={`material-symbols-outlined ${
            emailStatus.type === "success" ? "text-green-500" : "text-red-500"
          }`}>
            {emailStatus.type === "success" ? "check_circle" : "error"}
          </span>
          <div>
            <p className={`font-medium ${
              emailStatus.type === "success" ? "text-green-700 dark:text-green-400" : "text-red-700 dark:text-red-400"
            }`}>
              {emailStatus.message}
            </p>
            {emailStatus.details?.usersInDb && (
              <p className="text-xs text-slate-500 mt-1">
                {emailStatus.details.usersInDb.length} users in database
              </p>
            )}
          </div>
          <button 
            onClick={() => setEmailStatus(null)}
            className="ml-auto text-slate-400 hover:text-slate-600"
          >
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        </motion.div>
      )}
      </AnimatePresence>

      {/* Info Card */}
      <motion.div variants={itemVariants} className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/10 dark:to-red-900/10 border border-orange-200 dark:border-orange-800 rounded-2xl p-4 mb-6">
        <div className="flex items-start gap-3">
          <span className="material-symbols-outlined text-orange-500">info</span>
          <div>
            <p className="font-semibold text-orange-700 dark:text-orange-400">About Alerts</p>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Showing water quality reports with risk level ≥ 40% in your state. 
              You can send email notifications to all registered users in the affected region.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Loading State */}
      {loading ? (
        <motion.div variants={itemVariants} className="flex items-center justify-center py-20">
          <div className="animate-spin w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full"></div>
        </motion.div>
      ) : alerts.length === 0 ? (
        /* Empty State */
        <motion.div variants={itemVariants} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-12 text-center">
          <span className="material-symbols-outlined text-6xl text-green-500 mb-4">
            verified_user
          </span>
          <h3 className="text-xl font-bold mb-2">No Alerts</h3>
          <p className="text-slate-500 dark:text-slate-400">
            {userState 
              ? `No high-risk water reports in ${userState} at this time.`
              : "No high-risk water reports found."}
          </p>
        </motion.div>
      ) : (
        /* Alerts List */
        <motion.div variants={containerVariants} className="space-y-4">
          {alerts.map((alert, index) => (
            <motion.div
              key={alert._id || alert.reportId}
              variants={itemVariants}
              whileHover={{ scale: 1.01, y: -2 }}
              className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                {/* Risk Score */}
                <div className={`flex-shrink-0 w-20 h-20 rounded-2xl flex flex-col items-center justify-center ${getRiskColor(alert.prediction?.riskPercent || 0)}`}>
                  <span className="text-2xl font-bold">{alert.prediction?.riskPercent || 0}%</span>
                  <span className="text-xs uppercase font-medium">Risk</span>
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${getRiskBadge(alert.prediction?.riskLevel)}`}>
                      {alert.prediction?.riskLevel?.toUpperCase() || "UNKNOWN"}
                    </span>
                    <span className="text-xs text-slate-400">
                      {new Date(alert.createdAt).toLocaleDateString("en-US", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit"
                      })}
                    </span>
                  </div>

                  <h3 className="font-bold text-lg truncate flex items-center gap-2">
                    <span className="material-symbols-outlined text-blue-500">location_on</span>
                    {alert.locationName || "Unknown Location"}
                  </h3>

                  <div className="flex flex-wrap gap-4 mt-2 text-sm text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs">water_drop</span>
                      {alert.waterSource}
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs">science</span>
                      pH: {alert.pH}
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs">blur_on</span>
                      Turbidity: {alert.turbidity} NTU
                    </span>
                    {alert.bacteriaCount !== undefined && (
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-xs">coronavirus</span>
                        Bacteria: {alert.bacteriaCount} CFU
                      </span>
                    )}
                  </div>

                  {/* Diseases */}
                  {alert.prediction?.diseases && alert.prediction.diseases.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {alert.prediction.diseases.slice(0, 3).map((disease, idx) => (
                        <span 
                          key={idx}
                          className="px-2 py-1 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-xs font-medium"
                        >
                          {disease.name}: {disease.probability}%
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2 lg:flex-shrink-0">
                  <button
                    onClick={() => sendEmailAlert(alert)}
                    disabled={sending}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white rounded-xl transition-colors text-sm font-bold"
                  >
                    {sending ? (
                      <>
                        <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                        Sending...
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-sm">mail</span>
                        Send Alert
                      </>
                    )}
                  </button>
                  <a
                    href={`/prediction-result?reportId=${alert.reportId}`}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 rounded-xl transition-colors text-sm font-medium"
                  >
                    <span className="material-symbols-outlined text-sm">visibility</span>
                    View Details
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Summary Footer */}
      {!loading && alerts.length > 0 && (
        <motion.div variants={itemVariants} className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
          Showing {alerts.length} alert{alerts.length !== 1 ? "s" : ""} 
          {userState && ` in ${userState}`}
        </motion.div>
      )}
      </motion.div>
    </DashboardLayout>
  );
}

export default Alerts;
