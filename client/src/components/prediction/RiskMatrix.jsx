import React from "react";

const risks = [
  {
    disease: "Typhoid",
    description: "S. Typhi bacterial risk",
    percentage: 88,
    level: "CRITICAL",
    color: "rose",
    highlight: true,
    badge: "High Alert",
  },
  {
    disease: "Cholera",
    description: "V. Cholerae presence probability",
    percentage: 42,
    level: "MODERATE",
    color: "amber",
    highlight: false,
  },
  {
    disease: "Diarrhea",
    description: "Generalized waterborne risk",
    percentage: 25,
    level: "LOW",
    color: "sky",
    highlight: false,
  },
];

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
    badge: "",
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

const RiskMatrix = () => {
  return (
    <section className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
      {/* Background watermark */}
      <div className="absolute top-0 right-0 p-8 opacity-5 select-none pointer-events-none">
        <span className="material-symbols-outlined text-[120px]">
          troubleshoot
        </span>
      </div>

      <h2 className="text-xl font-bold mb-8 flex items-center gap-2">
        <span className="material-symbols-outlined text-blue-500">
          analytics
        </span>
        Risk Prediction Matrix
      </h2>

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
                  className={`absolute top-0 left-0 h-full ${c.bar} rounded-full`}
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
