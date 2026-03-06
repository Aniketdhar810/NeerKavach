import React from "react";

// Helper to determine if value is concerning
const getValueStyle = (label, value) => {
  if (label === "pH Level") {
    const pH = parseFloat(value);
    if (pH < 6.5 || pH > 8.5) return "text-amber-500";
    if (pH < 5.5 || pH > 9.5) return "text-rose-500";
  }
  if (label === "Turbidity") {
    const turb = parseFloat(value);
    if (turb > 5) return "text-rose-500";
    if (turb > 1) return "text-amber-500";
  }
  if (label === "Bacteria Count") {
    const count = parseFloat(value);
    if (count > 10000) return "text-rose-500";
    if (count > 1000) return "text-amber-500";
  }
  if (label === "Fecal Coliform") {
    if (value === "Present (Significant)") return "text-rose-600";
    if (value === "Present (Trace)") return "text-amber-500";
  }
  return "";
};

const WaterTestSummary = ({ data = {} }) => {
  // Build test data from props
  const testData = [
    { label: "Water Source", value: data.waterSource || "N/A", unit: "" },
    { label: "pH Level", value: data.pH?.toFixed(1) || "N/A", unit: "pH" },
    { label: "Turbidity", value: data.turbidity?.toFixed(1) || "N/A", unit: "NTU" },
    { label: "Dissolved Oxygen", value: data.dissolvedOxygen?.toFixed(1) || "N/A", unit: "mg/L" },
    { label: "Nitrate Level", value: data.nitrateLevel?.toFixed(2) || "N/A", unit: "mg/L" },
    { label: "Contaminant Level", value: data.contaminantLevel?.toFixed(1) || "N/A", unit: "ppm" },
    { label: "Bacteria Count", value: data.bacteriaCount?.toLocaleString() || "N/A", unit: "CFU/mL" },
    { label: "Fecal Coliform", value: data.fecalColiform || "N/A", unit: "" },
    { label: "Total Coliform", value: data.totalColiform?.toLocaleString() || "N/A", unit: "" },
    { label: "Temperature", value: data.temperature?.toFixed(1) || "N/A", unit: "°C" },
  ].map((item) => ({
    ...item,
    color: getValueStyle(item.label, item.value),
  }));

  return (
    <section className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <span className="material-symbols-outlined text-blue-500">
            biotech
          </span>
          Water Test Summary
        </h2>
        <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-600 text-xs font-bold rounded-full">
          ANALYZED
        </span>
      </div>

      <div className="space-y-3">
        {testData.map((item) => (
          <div
            key={item.label}
            className="flex justify-between items-center p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50"
          >
            <span className="text-sm text-slate-500">{item.label}</span>
            <span className={`font-semibold ${item.color || ""}`}>
              {item.value}{" "}
              {item.unit && (
                <span className="text-xs text-slate-400">{item.unit}</span>
              )}
            </span>
          </div>
        ))}
      </div>

      {data.locationName && (
        <div className="mt-8 p-4 bg-blue-500/5 dark:bg-blue-500/10 rounded-2xl border border-blue-500/10">
          <div className="flex items-center gap-3 mb-2">
            <span className="material-symbols-outlined text-blue-500">
              location_on
            </span>
            <span className="font-bold text-sm">Sample Location</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {data.locationName}
          </p>
          {data.latitude && data.longitude && (
            <p className="text-xs text-slate-400 mt-1">
              Coordinates: {data.latitude}, {data.longitude}
            </p>
          )}
        </div>
      )}
    </section>
  );
};

export default WaterTestSummary;
