import React, { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Sidebar from "../components/dashboard/Sidebar";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import MobileNav from "../components/dashboard/MobileNav";
import API from "../lib/api";

// Default center (India)
const defaultCenter = [22.5937, 78.9629];

// Create custom marker icon based on risk level
const createMarkerIcon = (riskLevel) => {
  const colors = {
    high: "#ef4444",
    moderate: "#f59e0b",
    low: "#10b981",
  };
  const color = colors[riskLevel] || colors.low;
  
  return L.divIcon({
    className: "custom-marker",
    html: `<div style="
      width: 24px;
      height: 24px;
      background-color: ${color};
      border: 3px solid white;
      border-radius: 50%;
      box-shadow: 0 2px 6px rgba(0,0,0,0.3);
    "></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12],
  });
};

// Component to handle map interactions
const MapController = ({ selectedHotspot, mapRef }) => {
  const map = useMap();
  
  useEffect(() => {
    if (mapRef) {
      mapRef.current = map;
    }
  }, [map, mapRef]);
  
  useEffect(() => {
    if (selectedHotspot && map) {
      map.flyTo([selectedHotspot.lat, selectedHotspot.lng], 12, {
        duration: 1,
      });
    }
  }, [selectedHotspot, map]);
  
  return null;
};

const HotspotMap = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [hotspots, setHotspots] = useState([]);
  const [selectedHotspot, setSelectedHotspot] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const mapRef = useRef(null);

  // Fetch real reports from API
  useEffect(() => {
    const fetchHotspots = async () => {
      try {
        setLoading(true);
        // Fetch real reports from the reports API
        const response = await API.get("/reports");
        
        if (response.data && response.data.length > 0) {
          // Transform real report data to hotspot format
          // Only include reports that have predictions and valid coordinates
          const transformedHotspots = response.data
            .filter(report => report.latitude && report.longitude)
            .map((report, index) => ({
              id: report._id || index,
              lat: report.latitude,
              lng: report.longitude,
              name: report.locationName || `Report ${report.reportId}`,
              waterSource: report.waterSource || "N/A",
              riskLevel: report.prediction?.riskLevel || "low",
              riskPercent: report.prediction?.riskPercent || 0,
              pH: report.pH || 7.0,
              turbidity: report.turbidity || 0,
              temperature: report.temperature || 25,
              diseases: report.prediction?.diseases || [],
              reportId: report.reportId,
              createdAt: report.createdAt,
            }));
          
          console.log("Hotspots from real reports:", transformedHotspots);
          setHotspots(transformedHotspots);
        } else {
          // No reports - show empty state
          setHotspots([]);
        }
      } catch (error) {
        console.error("Failed to fetch hotspots:", error);
        // On error, show empty state
        setHotspots([]);
      } finally {
        setLoading(false);
      }
    };

    fetchHotspots();
  }, []);

  const toggleTheme = () => {
    document.documentElement.classList.toggle("dark");
    setDarkMode(!darkMode);
  };

  // Filter hotspots
  const filteredHotspots = filter === "all" 
    ? hotspots 
    : hotspots.filter(h => h.riskLevel === filter);

  // Count by risk level
  const counts = {
    all: hotspots.length,
    high: hotspots.filter(h => h.riskLevel === "high").length,
    moderate: hotspots.filter(h => h.riskLevel === "moderate").length,
    low: hotspots.filter(h => h.riskLevel === "low").length,
  };

  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-screen transition-colors duration-300">
      <div className="flex h-screen overflow-hidden">
        <Sidebar />

        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <DashboardHeader darkMode={darkMode} onToggleTheme={toggleTheme} />

          {/* Map area */}
          <div className="flex-1 flex overflow-hidden">
            {/* Sidebar filters */}
            <div className="w-80 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 overflow-y-auto hidden md:block">
              <div className="p-6">
                <h2 className="text-lg font-bold mb-4">Risk Hotspots</h2>
                
                {/* Filter buttons */}
                <div className="space-y-2 mb-6">
                  {[
                    { key: "all", label: "All Hotspots", color: "bg-slate-500" },
                    { key: "high", label: "High Risk", color: "bg-red-500" },
                    { key: "moderate", label: "Moderate Risk", color: "bg-amber-500" },
                    { key: "low", label: "Low Risk", color: "bg-emerald-500" },
                  ].map((f) => (
                    <button
                      key={f.key}
                      onClick={() => setFilter(f.key)}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
                        filter === f.key
                          ? "bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-500"
                          : "bg-slate-50 dark:bg-slate-800 border-2 border-transparent hover:border-slate-200 dark:hover:border-slate-700"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`w-3 h-3 rounded-full ${f.color}`} />
                        <span className="font-medium">{f.label}</span>
                      </div>
                      <span className="text-sm font-bold text-slate-400">{counts[f.key]}</span>
                    </button>
                  ))}
                </div>

                {/* Hotspot list */}
                <div className="space-y-3">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Report Locations ({filteredHotspots.length})
                  </p>
                  {filteredHotspots.length === 0 ? (
                    <div className="text-center py-8">
                      <span className="material-symbols-outlined text-4xl text-slate-300 mb-2">location_off</span>
                      <p className="text-sm text-slate-400">No reports yet</p>
                      <p className="text-xs text-slate-400 mt-1">Submit a water test to see locations</p>
                    </div>
                  ) : (
                    filteredHotspots.slice(0, 10).map((hs) => (
                    <button
                      key={hs.id}
                      onClick={() => setSelectedHotspot(hs)}
                      className={`w-full text-left p-4 rounded-xl border transition-all ${
                        selectedHotspot?.id === hs.id
                          ? "bg-blue-50 dark:bg-blue-900/20 border-blue-500"
                          : "bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-700 hover:border-blue-300"
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <span className="font-bold text-sm">{hs.name}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          hs.riskLevel === "high"
                            ? "bg-red-100 dark:bg-red-900/30 text-red-600"
                            : hs.riskLevel === "moderate"
                            ? "bg-amber-100 dark:bg-amber-900/30 text-amber-600"
                            : "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600"
                        }`}>
                          {hs.riskPercent}%
                        </span>
                      </div>
                      <p className="text-xs text-slate-400">{hs.waterSource}</p>
                      <div className="flex gap-4 mt-2 text-xs">
                        <span>pH: <strong>{hs.pH}</strong></span>
                        <span>Turb: <strong>{hs.turbidity}</strong></span>
                      </div>
                    </button>
                  ))
                  )}
                </div>
              </div>
            </div>

            {/* Leaflet Map with OpenStreetMap */}
            <div className="flex-1 relative">
              {loading ? (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-100 dark:bg-slate-900">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-slate-500">Loading Map...</p>
                  </div>
                </div>
              ) : (
                <MapContainer
                  center={defaultCenter}
                  zoom={5}
                  style={{ height: "100%", width: "100%" }}
                  className="z-0"
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url={darkMode 
                      ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                      : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    }
                  />
                  <MapController selectedHotspot={selectedHotspot} mapRef={mapRef} />
                  
                  {filteredHotspots.map((hotspot) => (
                    <Marker
                      key={hotspot.id}
                      position={[hotspot.lat, hotspot.lng]}
                      icon={createMarkerIcon(hotspot.riskLevel)}
                      eventHandlers={{
                        click: () => setSelectedHotspot(hotspot),
                      }}
                    >
                      <Popup className="custom-popup" maxWidth={300}>
                        <div className="p-1 min-w-[250px]">
                          <h3 className="font-bold text-lg mb-2 text-slate-800">{hotspot.name}</h3>
                          <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase mb-3 ${
                            hotspot.riskLevel === "high"
                              ? "bg-red-100 text-red-600"
                              : hotspot.riskLevel === "moderate"
                              ? "bg-amber-100 text-amber-600"
                              : "bg-emerald-100 text-emerald-600"
                          }`}>
                            {hotspot.riskLevel} Risk - {hotspot.riskPercent}%
                          </div>
                          
                          <div className="grid grid-cols-2 gap-2 text-sm mb-3 text-slate-700">
                            <div><span className="text-gray-500">Source:</span> {hotspot.waterSource}</div>
                            <div><span className="text-gray-500">pH:</span> {hotspot.pH}</div>
                            <div><span className="text-gray-500">Turbidity:</span> {hotspot.turbidity} NTU</div>
                            <div><span className="text-gray-500">Temp:</span> {hotspot.temperature}°C</div>
                          </div>
                          
                          {hotspot.diseases?.length > 0 && (
                            <div className="border-t pt-2">
                              <p className="text-xs font-semibold text-gray-500 mb-2">Disease Risk:</p>
                              <div className="space-y-1">
                                {hotspot.diseases.map((d, i) => (
                                  <div key={i} className="flex items-center justify-between text-sm text-slate-700">
                                    <span>{d.name}</span>
                                    <div className="flex items-center gap-2">
                                      <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                                        <div 
                                          className={`h-full rounded-full ${
                                            d.probability >= 50 ? "bg-red-500" : d.probability >= 25 ? "bg-amber-500" : "bg-emerald-500"
                                          }`}
                                          style={{ width: `${d.probability}%` }}
                                        />
                                      </div>
                                      <span className="font-bold text-xs w-10">{d.probability}%</span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </Popup>
                    </Marker>
                  ))}
                </MapContainer>
              )}

              {/* Empty state overlay */}
              {!loading && hotspots.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 z-20 pointer-events-none">
                  <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-xl text-center pointer-events-auto">
                    <span className="material-symbols-outlined text-5xl text-slate-300 mb-3">map</span>
                    <h3 className="font-bold text-lg mb-1">No Reports Yet</h3>
                    <p className="text-sm text-slate-500">Submit water test reports to see them on the map</p>
                  </div>
                </div>
              )}

              {/* Legend */}
              <div className="absolute bottom-6 left-6 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xl z-10">
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
