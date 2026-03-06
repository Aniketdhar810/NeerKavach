import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
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

const waterSourceOptions = [
  "Borewell",
  "Municipal Supply",
  "Surface Water (River/Lake)",
  "Open Well",
  "Pond",
];

const fecalColiformOptions = [
  "Absent",
  "Present (Trace)",
  "Present (Significant)",
];

const initialForm = {
  waterSource: "Borewell",
  pH: "",
  turbidity: "",
  dissolvedOxygen: "",
  nitrateLevel: "",
  contaminantLevel: "",
  bacteriaCount: "",
  fecalColiform: "Absent",
  totalColiform: "",
  temperature: "",
  locationName: "",
  latitude: "",
  longitude: "",
};

const SubmitTest = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAutoDetect = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setForm((prev) => ({
            ...prev,
            latitude: pos.coords.latitude.toFixed(4),
            longitude: pos.coords.longitude.toFixed(4),
          }));
        },
        () => alert("Unable to detect location. Please enter manually.")
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      // Submit the report
      const reportRes = await API.post("/reports", form);
      const reportId = reportRes.data.report.reportId;

      // Trigger AI prediction
      const predRes = await API.post(`/prediction/${reportId}`);

      setSubmitting(false);
      navigate("/prediction-result", {
        state: { reportId, prediction: predRes.data },
      });
    } catch (error) {
      setSubmitting(false);
      const msg = error.response?.data?.message || "Submission failed. Please try again.";
      alert(msg);
    }
  };

  const inputClass =
    "w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg shadow-sm px-4 py-2.5 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 dark:text-white outline-none";

  return (
    <DashboardLayout>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-8"
      >
      {/* Page Title */}
      <motion.div variants={itemVariants} className="mb-10">
        <h1 className="text-3xl font-extrabold tracking-tight mb-2">
          Submit Water Quality Test
        </h1>
        <p className="text-slate-500 dark:text-slate-400">
          Enter laboratory results or field surveillance data to update regional
          water health metrics.
        </p>
      </motion.div>

      <motion.form variants={itemVariants} onSubmit={handleSubmit} className="space-y-8">
        {/* ── Laboratory Metrics ── */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">
              science
            </span>
            <h2 className="font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider text-xs">
              Laboratory Metrics
            </h2>
          </div>

          <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Water Source */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                Water Source Type
              </label>
              <select
                name="waterSource"
                value={form.waterSource}
                onChange={handleChange}
                className={inputClass}
              >
                {waterSourceOptions.map((opt) => (
                  <option key={opt}>{opt}</option>
                ))}
              </select>
            </div>

            {/* pH */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                pH Level
              </label>
              <div className="relative">
                <input
                  name="pH"
                  type="number"
                  step="0.1"
                  placeholder="7.0"
                  value={form.pH}
                  onChange={handleChange}
                  className={inputClass}
                />
                <span className="absolute right-3 top-2.5 text-slate-400 text-xs font-medium">
                  pH
                </span>
              </div>
            </div>

            {/* Turbidity */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                Turbidity
              </label>
              <div className="relative">
                <input
                  name="turbidity"
                  type="number"
                  step="0.01"
                  placeholder="1.0"
                  value={form.turbidity}
                  onChange={handleChange}
                  className={inputClass}
                />
                <span className="absolute right-3 top-2.5 text-slate-400 text-xs font-medium uppercase">
                  NTU
                </span>
              </div>
            </div>

            {/* Dissolved Oxygen */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                Dissolved Oxygen
              </label>
              <div className="relative">
                <input
                  name="dissolvedOxygen"
                  type="number"
                  step="0.1"
                  placeholder="8.5"
                  value={form.dissolvedOxygen}
                  onChange={handleChange}
                  className={inputClass}
                />
                <span className="absolute right-3 top-2.5 text-slate-400 text-xs font-medium uppercase">
                  mg/L
                </span>
              </div>
            </div>

            {/* Nitrate */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                Nitrate Level
              </label>
              <div className="relative">
                <input
                  name="nitrateLevel"
                  type="number"
                  step="0.01"
                  placeholder="10.0"
                  value={form.nitrateLevel}
                  onChange={handleChange}
                  className={inputClass}
                />
                <span className="absolute right-3 top-2.5 text-slate-400 text-xs font-medium uppercase">
                  mg/L
                </span>
              </div>
            </div>

            {/* Contaminant */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                Contaminant Level
              </label>
              <div className="relative">
                <input
                  name="contaminantLevel"
                  type="number"
                  placeholder="50"
                  value={form.contaminantLevel}
                  onChange={handleChange}
                  className={`${inputClass} text-red-600 dark:text-red-400 font-bold`}
                />
                <span className="absolute right-3 top-2.5 text-slate-400 text-xs font-medium uppercase">
                  PPM
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Biological Analysis ── */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 flex items-center gap-2">
            <span className="material-symbols-outlined text-red-500">
              biotech
            </span>
            <h2 className="font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider text-xs">
              Biological Analysis
            </h2>
          </div>

          <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Bacteria Count */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                Bacteria Count
              </label>
              <div className="relative">
                <input
                  name="bacteriaCount"
                  type="number"
                  placeholder="0"
                  value={form.bacteriaCount}
                  onChange={handleChange}
                  className={inputClass}
                />
                <span className="absolute right-3 top-2.5 text-slate-400 text-xs font-medium uppercase">
                  CFU/mL
                </span>
              </div>
            </div>

            {/* Fecal Coliform */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                Fecal Coliform
              </label>
              <select
                name="fecalColiform"
                value={form.fecalColiform}
                onChange={handleChange}
                className={inputClass}
              >
                {fecalColiformOptions.map((opt) => (
                  <option key={opt}>{opt}</option>
                ))}
              </select>
            </div>

            {/* Total Coliform */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                Total Coliform
              </label>
              <div className="relative">
                <input
                  name="totalColiform"
                  type="number"
                  placeholder="0"
                  value={form.totalColiform}
                  onChange={handleChange}
                  className={inputClass}
                />
                <span className="absolute right-3 top-2.5 text-slate-400 text-xs font-medium uppercase">
                  MPN/100ml
                </span>
              </div>
            </div>

            {/* Temperature */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                Water Temperature
              </label>
              <div className="relative">
                <input
                  name="temperature"
                  type="number"
                  step="0.1"
                  placeholder="25.0"
                  value={form.temperature}
                  onChange={handleChange}
                  className={inputClass}
                />
                <span className="absolute right-3 top-2.5 text-slate-400 text-xs font-medium">
                  °C
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Geospatial Information ── */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 flex items-center gap-2">
            <span className="material-symbols-outlined text-emerald-500">
              location_on
            </span>
            <h2 className="font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider text-xs">
              Geospatial Information
            </h2>
          </div>

          <div className="p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Location Name */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Location Name
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 material-symbols-outlined text-slate-400 text-lg">
                    search
                  </span>
                  <input
                    name="locationName"
                    type="text"
                    placeholder="e.g. Malviya Nagar Sector 4, Jaipur"
                    value={form.locationName}
                    onChange={handleChange}
                    className={`${inputClass} pl-10`}
                  />
                </div>
              </div>

              {/* Tested By */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Tested By (Authority Name)
                </label>
                <input
                  type="text"
                  value={(() => {
                    try {
                      const user = JSON.parse(localStorage.getItem("user") || "{}");
                      return user.name || "Unknown Reporter";
                    } catch { return "Unknown Reporter"; }
                  })()}
                  disabled
                  className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700 rounded-lg shadow-sm px-4 py-2.5 dark:text-slate-400 cursor-not-allowed"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Latitude */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Latitude
                </label>
                <input
                  name="latitude"
                  type="text"
                  placeholder="26.8530"
                  value={form.latitude}
                  onChange={handleChange}
                  className={`${inputClass} font-mono text-sm`}
                />
              </div>

              {/* Longitude */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Longitude
                </label>
                <input
                  name="longitude"
                  type="text"
                  placeholder="75.8236"
                  value={form.longitude}
                  onChange={handleChange}
                  className={`${inputClass} font-mono text-sm`}
                />
              </div>

              {/* Auto-detect */}
              <div className="flex items-end">
                <button
                  type="button"
                  onClick={handleAutoDetect}
                  className="w-full h-[42px] flex items-center justify-center gap-2 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-all text-sm font-medium text-slate-700 dark:text-slate-300"
                >
                  <span className="material-symbols-outlined text-lg">
                    my_location
                  </span>
                  Auto-detect Location
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ── Submit Actions ── */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-6">
          <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400">
            <span className="material-symbols-outlined text-yellow-500">
              verified_user
            </span>
            <p className="text-sm">
              Data will be used for AI Disease Risk Prediction models across
              Indian health networks.
            </p>
          </div>

          <div className="flex gap-4 w-full sm:w-auto">
            <button
              type="button"
              className="flex-1 px-8 py-4 font-bold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl transition-all"
            >
              Draft
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-[2] px-12 py-4 bg-primary hover:bg-brand-deep text-white font-bold rounded-xl shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2"
            >
              {submitting ? (
                <span className="animate-spin material-symbols-outlined">
                  sync
                </span>
              ) : (
                <>
                  <span>Analyze Water Sample</span>
                  <span className="material-symbols-outlined">analytics</span>
                </>
              )}
            </button>
          </div>
        </div>
      </motion.form>

      {/* ── Info Cards ── */}
      <motion.div variants={itemVariants} className="mt-16 pt-8 border-t border-slate-200 dark:border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-8">
        <InfoCard
          icon="auto_graph"
          iconBg="bg-blue-50 dark:bg-blue-900/30"
          iconColor="text-primary"
          title="Real-time Analysis"
          text="AI models provide instant risk scores for cholera and typhoid based on these parameters."
        />
        <InfoCard
          icon="cloud_upload"
          iconBg="bg-emerald-50 dark:bg-emerald-900/30"
          iconColor="text-emerald-600"
          title="Centralized Registry"
          text="Synchronized with national health databases for epidemic prevention monitoring."
        />
        <InfoCard
          icon="priority_high"
          iconBg="bg-amber-50 dark:bg-amber-900/30"
          iconColor="text-amber-600"
          title="Alert System"
          text="If levels exceed safety threshold, automated SMS alerts are sent to local district officers."
        />
      </motion.div>
      </motion.div>
    </DashboardLayout>
  );
};

const InfoCard = ({ icon, iconBg, iconColor, title, text }) => (
  <div className="flex gap-4">
    <div
      className={`h-10 w-10 shrink-0 ${iconBg} rounded-full flex items-center justify-center`}
    >
      <span className={`material-symbols-outlined ${iconColor} text-xl`}>
        {icon}
      </span>
    </div>
    <div>
      <h4 className="font-bold text-sm">{title}</h4>
      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{text}</p>
    </div>
  </div>
);

export default SubmitTest;
