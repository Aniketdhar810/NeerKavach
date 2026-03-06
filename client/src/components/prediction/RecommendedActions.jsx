import React from "react";

const householdActions = [
  "Boil water for at least 1 minute before drinking or cooking.",
  "Distribute Halazone tablets (Chlorine tablets) to affected households.",
  "Enforce hand-washing protocols after toilet use and before meals.",
];

const publicHealthActions = [
  "Immediate super-chlorination of the community storage tank.",
  "Conduct sanitation drive (Swachhata) around the water source.",
  "Mandatory inspection of supply pipe leakages in Ward 12.",
];

const ActionCard = ({ title, icon, actions, colorScheme }) => {
  const colors = {
    blue: {
      bg: "bg-blue-50/50 dark:bg-blue-900/10",
      border: "border-blue-100 dark:border-blue-800/50",
      iconBg: "bg-blue-500",
      title: "text-blue-900 dark:text-blue-100",
      text: "text-blue-800 dark:text-blue-300",
    },
    emerald: {
      bg: "bg-emerald-50/50 dark:bg-emerald-900/10",
      border: "border-emerald-100 dark:border-emerald-800/50",
      iconBg: "bg-emerald-500",
      title: "text-emerald-900 dark:text-emerald-100",
      text: "text-emerald-800 dark:text-emerald-300",
    },
  };
  const c = colors[colorScheme];

  return (
    <div className={`p-6 rounded-3xl ${c.bg} border ${c.border}`}>
      <div className="flex items-center gap-3 mb-4">
        <div
          className={`w-10 h-10 rounded-2xl ${c.iconBg} flex items-center justify-center text-white`}
        >
          <span className="material-symbols-outlined">{icon}</span>
        </div>
        <h3 className={`font-bold ${c.title}`}>{title}</h3>
      </div>
      <ul className="space-y-3">
        {actions.map((action, i) => (
          <li key={i} className={`flex gap-3 text-sm ${c.text}`}>
            <span className="material-symbols-outlined text-sm mt-0.5">
              check_circle
            </span>
            <span>{action}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

const RecommendedActions = () => {
  return (
    <section className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
      <div className="mb-8">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <span className="material-symbols-outlined text-blue-500">
            verified_user
          </span>
          Awareness &amp; Recommended Actions
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Based on Indian Public Health Guidelines (IPHS)
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ActionCard
          title="Household Actions"
          icon="home"
          actions={householdActions}
          colorScheme="blue"
        />
        <ActionCard
          title="Public Health Response"
          icon="groups"
          actions={publicHealthActions}
          colorScheme="emerald"
        />
      </div>

      {/* ASHA Workers Alert */}
      <div className="mt-8 flex items-start gap-4 p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
        <span className="material-symbols-outlined text-amber-500">info</span>
        <div>
          <p className="text-sm font-semibold">ASHA Workers Alert</p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Deploy ASHA workers for door-to-door surveillance of fever cases and
            distribution of ORS packets in the high-risk zone immediately.
          </p>
        </div>
      </div>
    </section>
  );
};

export default RecommendedActions;
