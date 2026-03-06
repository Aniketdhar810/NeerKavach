import React, { useState } from "react";
import Sidebar from "../components/dashboard/Sidebar";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import MobileNav from "../components/dashboard/MobileNav";
import MapSidebar from "../components/hotspot/MapSidebar";
import HotspotPopup from "../components/hotspot/HotspotPopup";

const hotspots = [
  {
    id: 1,
    district: "Dharavi District",
    region: "Mumbai, Maharashtra",
    riskLevel: "high",
    ph: "5.8",
    phNote: "Acidic",
    turbidity: "8.4",
    top: "50%",
    left: "25%",
    size: "w-6 h-6",
    ping: true,
    diseases: [
      { name: "Diarrhea", probability: 88, color: "text-red-500", barColor: "bg-red-500" },
      { name: "Cholera", probability: 42, color: "text-orange-500", barColor: "bg-orange-500" },
      { name: "Typhoid", probability: 12, color: "text-emerald-500", barColor: "bg-emerald-500" },
    ],
  },
  {
    id: 2,
    district: "Shivajinagar Ward",
    region: "Pune, Maharashtra",
    riskLevel: "moderate",
    ph: "6.8",
    phNote: null,
    turbidity: "5.1",
    top: "40%",
    left: "45%",
    size: "w-5 h-5",
    ping: false,
    diseases: [
      { name: "Diarrhea", probability: 45, color: "text-amber-500", barColor: "bg-amber-500" },
      { name: "Cholera", probability: 20, color: "text-amber-500", barColor: "bg-amber-500" },
      { name: "Typhoid", probability: 35, color: "text-amber-500", barColor: "bg-amber-500" },
    ],
  },
  {
    id: 3,
    district: "Madurai South",
    region: "Madurai, Tamil Nadu",
    riskLevel: "low",
    ph: "7.2",
    phNote: null,
    turbidity: "1.2",
    top: "75%",
    left: "48%",
    size: "w-4 h-4",
    ping: false,
    diseases: [
      { name: "Diarrhea", probability: 8, color: "text-emerald-500", barColor: "bg-emerald-500" },
      { name: "Cholera", probability: 3, color: "text-emerald-500", barColor: "bg-emerald-500" },
      { name: "Typhoid", probability: 5, color: "text-emerald-500", barColor: "bg-emerald-500" },
    ],
  },
  {
    id: 4,
    district: "Chandigarh Sector 17",
    region: "Chandigarh, Punjab",
    riskLevel: "low",
    ph: "7.4",
    phNote: null,
    turbidity: "0.9",
    top: "15%",
    left: "38%",
    size: "w-4 h-4",
    ping: false,
    diseases: [
      { name: "Diarrhea", probability: 5, color: "text-emerald-500", barColor: "bg-emerald-500" },
      { name: "Cholera", probability: 2, color: "text-emerald-500", barColor: "bg-emerald-500" },
      { name: "Typhoid", probability: 3, color: "text-emerald-500", barColor: "bg-emerald-500" },
    ],
  },
];

const borderColors = {
  high: "border-red-500",
  moderate: "border-amber-500",
  low: "border-emerald-500",
};

const HotspotMap = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [selectedHotspot, setSelectedHotspot] = useState(hotspots[0]);

  const toggleTheme = () => {
    document.documentElement.classList.toggle("dark");
    setDarkMode(!darkMode);
  };

  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-screen transition-colors duration-300">
      <div className="flex h-screen overflow-hidden">
        {/* App navigation sidebar */}
        <Sidebar />

        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <DashboardHeader darkMode={darkMode} onToggleTheme={toggleTheme} />

          {/* Map area: filter sidebar + map */}
          <div className="flex-1 flex overflow-hidden">
            <MapSidebar />

            {/* Map Canvas */}
            <div className="flex-1 relative overflow-hidden bg-slate-100 dark:bg-slate-950">
              {/* Map background */}
              <div className="absolute inset-0 map-gradient">
                <img
                  alt="Map pattern background"
                  className="w-full h-full object-cover opacity-20 dark:opacity-10 mix-blend-multiply dark:mix-blend-overlay"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCozYhpB2h13L5mSZrTFf92r36JVHHWy7yJsBoRGMLYSoV6Z2TBHoVgCJzMY1Fv9iTcQI0HO1hczgHmk2KUQ_hHc4z9rjokuCl2k4TOcT6cTEC3EDcO8TTGebPnOss2D367ue79OZzrPMsgVq3LvEctcWVkPmdH2Luub6VCrOJqWsIVh_4dfc_EUiDbR9XAHk1gGstziYh516vPMjsr7GQz3U0ZDScBaQ9gaEucBwZ1G-wBPELk18AgXjrbJ39GTSVVMGXgClzRqXJi"
                />

                {/* Hotspot Markers */}
                {hotspots.map((hs) => (
                  <button
                    key={hs.id}
                    className="absolute group focus:outline-none"
                    style={{
                      top: hs.top,
                      left: hs.left,
                      transform: "translate(-50%, -50%)",
                    }}
                    onClick={() =>
                      setSelectedHotspot(
                        selectedHotspot?.id === hs.id ? null : hs
                      )
                    }
                  >
                    {hs.ping && (
                      <span
                        className={`absolute inline-flex h-12 w-12 rounded-full opacity-20 animate-ping ${
                          hs.riskLevel === "high"
                            ? "bg-red-500"
                            : hs.riskLevel === "moderate"
                            ? "bg-amber-500"
                            : "bg-emerald-500"
                        }`}
                        style={{
                          top: "50%",
                          left: "50%",
                          transform: "translate(-50%, -50%)",
                        }}
                      />
                    )}
                    <div
                      className={`relative ${hs.size} bg-white dark:bg-slate-900 rounded-full border-4 ${borderColors[hs.riskLevel]} flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform`}
                    />
                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap bg-slate-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                      {hs.district}
                    </div>
                  </button>
                ))}
              </div>

              {/* Popup */}
              {selectedHotspot && (
                <HotspotPopup
                  hotspot={{
                    ...selectedHotspot,
                    popupY: selectedHotspot.top,
                    popupX: selectedHotspot.left,
                  }}
                  onClose={() => setSelectedHotspot(null)}
                />
              )}

              {/* Map Controls */}
              <div className="absolute bottom-6 right-6 flex flex-col gap-2 z-20">
                <div className="bg-white dark:bg-slate-900 p-1 rounded-lg shadow-xl border border-slate-200 dark:border-slate-800 flex flex-col">
                  <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md">
                    <span className="material-symbols-outlined">add</span>
                  </button>
                  <div className="h-px bg-slate-200 dark:bg-slate-800" />
                  <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md">
                    <span className="material-symbols-outlined">remove</span>
                  </button>
                </div>
                <button className="p-3 bg-white dark:bg-slate-900 rounded-lg shadow-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                  <span className="material-symbols-outlined">
                    my_location
                  </span>
                </button>
                <button className="p-3 bg-white dark:bg-slate-900 rounded-lg shadow-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                  <span className="material-symbols-outlined">layers</span>
                </button>
              </div>

              {/* Legend */}
              <div className="absolute bottom-6 left-6 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xl z-20">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">
                  Risk Intensity
                </p>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-emerald-500" />
                    <span className="text-xs font-medium">Low</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-amber-500" />
                    <span className="text-xs font-medium">Moderate</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-red-500" />
                    <span className="text-xs font-medium">High</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <MobileNav />
    </div>
  );
};

export default HotspotMap;
