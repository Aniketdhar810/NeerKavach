import React from "react";

// Helper to get risk level from percentage
const getRiskLevel = (percentage) => {
  if (percentage >= 50) return "CRITICAL";
  if (percentage >= 25) return "MODERATE";
  return "LOW";
};

// Helper to get color based on percentage
const getColorFromPercentage = (percentage) => {
  if (percentage >= 50) return "rose";
  if (percentage >= 25) return "amber";
  return "sky";
};

const colorMap = {
  rose: {
    bar: "bg-rose-500",
    text: "text-rose-500",
    label: "text-rose-600",
    border: "border-rose-500",
    bg: "bg-rose-50/50 dark:bg-rose-900/10",
    shadow: "shadow-lg shadow-rose-200/20 dark:shadow-none",
    badge: "bg-rose-500",
  },
  amber: {
    bar: "bg-amber-500",
    text: "text-amber-500",
    label: "text-amber-600",
    border: "border-slate-200 dark:border-slate-800 hover:border-amber-300",
    bg: "bg-white dark:bg-slate-900/50",
    shadow: "",
    badge: "bg-amber-500",
  },
  sky: {
    bar: "bg-sky-500",
    text: "text-sky-500",
    label: "text-sky-500/80",
    border: "border-slate-200 dark:border-slate-800 hover:border-sky-300",
    bg: "bg-white dark:bg-slate-900/50",
    shadow: "",
    badge: "",
  },
};

const diseaseDescriptions = {
  Diarrhea: "Generalized waterborne risk",
  Cholera: "V. Cholerae presence probability",
  Typhoid: "S. Typhi bacterial risk",
};

const RiskMatrix = ({ diseases = [], riskLevel, riskPercent }) => {
  // Transform diseases data for display
  const risks = diseases.map((disease, index) => {
    const percentage = Math.round(disease.probability || 0);
    const color = getColorFromPercentage(percentage);
    const level = getRiskLevel(percentage);
    const isHighest = diseases.every((d) => d.probability <= disease.probability);

    return {
      disease: disease.name,
      description: diseaseDescriptions[disease.name] || "Disease risk assessment",
      percentage,
      level,
      color,
      highlight: percentage >= 50,
      badge: percentage >= 50 ? "High Alert" : percentage >= 30 ? "Warning" : null,
    };
  });

  // Sort by probability descending
  risks.sort((a, b) => b.percentage - a.percentage);

  // If no diseases provided, show placeholder
  if (risks.length === 0) {
    return (
      <section className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
        <h2 className="text-xl font-bold mb-8 flex items-center gap-2">
          <span className="material-symbols-outlined text-blue-500">
            analytics
          </span>
          Risk Prediction Matrix
        </h2>
        <div className="text-center py-8 text-slate-400">
          No prediction data available
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
      {/* Background watermark */}
      <div className="absolute top-0 right-0 p-8 opacity-5 select-none pointer-events-none">
        <span className="material-symbols-outlined text-[120px]">
          troubleshoot
        </span>
      </div>

      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <span className="material-symbols-outlined text-blue-500">
            analytics
          </span>
          Risk Prediction Matrix
        </h2>
        {riskPercent !== undefined && (
          <div
            className={`px-4 py-2 rounded-full text-sm font-bold ${
              riskLevel === "high"
                ? "bg-rose-100 text-rose-600 dark:bg-rose-900/30"
                : riskLevel === "moderate"
                ? "bg-amber-100 text-amber-600 dark:bg-amber-900/30"
                : "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30"
            }`}
          >
            Overall Risk: {riskPercent}%
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {risks.map((risk) => {
          const c = colorMap[risk.color];
          return (
            <div
              key={risk.disease}
              className={`relative p-6 rounded-3xl transition-all ${
                risk.highlight ? `border-2 ${c.border} ${c.bg} ${c.shadow}` : `border ${c.border} ${c.bg}`
              }`}
            >
              {risk.badge && (
                <div
                  className={`absolute -top-3 right-4 ${c.badge} text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest`}
                >
                  {risk.badge}
                </div>
              )}
              <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-1">
                {risk.disease}
              </h3>
              <p className="text-xs text-slate-500 mb-4">
                {risk.description}
              </p>
              <div className="relative h-2 w-full bg-slate-200 dark:bg-slate-700 rounded-full mb-4 overflow-hidden">
                <div
                  className={`absolute top-0 left-0 h-full ${c.bar} rounded-full transition-all duration-500`}
                  style={{ width: `${risk.percentage}%` }}
                />
              </div>
              <div className="flex items-baseline justify-between">
                <span className={`text-3xl font-black ${c.text}`}>
                  {risk.percentage}%
                </span>
                <span className={`text-xs font-medium ${c.label}`}>
                  {risk.level}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default RiskMatrix;
