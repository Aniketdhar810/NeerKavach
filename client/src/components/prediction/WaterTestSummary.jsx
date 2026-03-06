import React from "react";

const testData = [
  { label: "pH Level", value: "8.2", unit: "pH" },
  { label: "Turbidity", value: "5.4", unit: "NTU", color: "text-amber-500" },
  {
    label: "Free Chlorine",
    value: "0.1",
    unit: "mg/L",
    color: "text-rose-500",
  },
  { label: "Total Coliform", value: "Present", color: "text-rose-600" },
  {
    label: "E. Coli Count",
    value: "12",
    unit: "CFU/100ml",
    color: "text-rose-600",
  },
  { label: "TDS", value: "450", unit: "ppm" },
];

const WaterTestSummary = () => {
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
          SUBMITTED
        </span>
      </div>

      <div className="space-y-4">
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

      <div className="mt-8 p-4 bg-blue-500/5 dark:bg-blue-500/10 rounded-2xl border border-blue-500/10">
        <div className="flex items-center gap-3 mb-2">
          <span className="material-symbols-outlined text-blue-500">
            location_on
          </span>
          <span className="font-bold text-sm">Sample Location</span>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Ward No. 12, Shivajinagar, Pune, Maharashtra - Community Tank B
        </p>
      </div>
    </section>
  );
};

export default WaterTestSummary;
