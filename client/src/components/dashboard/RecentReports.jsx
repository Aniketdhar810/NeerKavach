import React from "react";

const reports = [
  {
    location: "Indiranagar, BLR",
    source: "Groundwater Bore",
    ph: "7.2",
    turbidity: "0.8 NTU",
    bacteria: "0 CFU",
    risk: "4% Low",
    riskLevel: "low",
    date: "Oct 24, 09:20",
  },
  {
    location: "Mysuru Central",
    source: "Municipal Tap",
    ph: "6.8",
    turbidity: "4.5 NTU",
    bacteria: "12 CFU",
    risk: "42% Med",
    riskLevel: "moderate",
    date: "Oct 24, 08:45",
  },
  {
    location: "Bellandur North",
    source: "Surface Drain",
    ph: "8.9",
    turbidity: "18.2 NTU",
    bacteria: "150+ CFU",
    risk: "92% High",
    riskLevel: "high",
    date: "Oct 23, 17:10",
  },
  {
    location: "HSR Layout",
    source: "Lakeside Well",
    ph: "7.4",
    turbidity: "2.1 NTU",
    bacteria: "8 CFU",
    risk: "28% Low",
    riskLevel: "low",
    date: "Oct 23, 14:30",
  },
  {
    location: "Whitefield Ext",
    source: "Tanker Supply",
    ph: "7.0",
    turbidity: "1.2 NTU",
    bacteria: "2 CFU",
    risk: "8% Low",
    riskLevel: "low",
    date: "Oct 23, 11:15",
  },
];

const riskStyles = {
  low: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400",
  moderate: "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400",
  high: "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400",
};

const RecentReports = () => {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700/50 shadow-sm flex flex-col">
      <div className="p-6 border-b border-slate-100 dark:border-slate-700/50 flex items-center justify-between">
        <h2 className="text-lg font-bold">Recent Reports</h2>
        <button className="text-xs font-bold text-blue-500 hover:underline">
          View All
        </button>
      </div>
      <div className="overflow-x-auto">
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
            {reports.map((r, i) => (
              <tr
                key={i}
                className="hover:bg-slate-50 dark:hover:bg-slate-900/30 transition-colors"
              >
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="font-bold">{r.location}</span>
                    <span className="text-[10px] text-slate-400">
                      {r.source}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 font-medium">{r.ph}</td>
                <td className="px-6 py-4 font-medium text-slate-400">
                  {r.turbidity}
                </td>
                <td className="px-6 py-4 font-medium">{r.bacteria}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase ${riskStyles[r.riskLevel]}`}
                  >
                    {r.risk}
                  </span>
                </td>
                <td className="px-6 py-4 text-xs text-slate-400">{r.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentReports;
