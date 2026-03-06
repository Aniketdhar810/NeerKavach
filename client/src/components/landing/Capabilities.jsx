import React from "react";

const Capabilities = () => {
  return (
    <section id="capabilities" className="py-32 bg-white">
      <div className="max-w-7xl mx-auto px-8">
        {/* Section Header */}
        <div className="mb-20 text-center">
          <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-slate-400 block mb-4">
            Core Capabilities
          </span>
          <h2 className="text-4xl md:text-5xl font-serif text-slate-900 italic">
            Engineered for absolute safety.
          </h2>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Accuracy Card */}
          <div className="md:col-span-1 bento-item bg-slate-50">
            <div className="flex justify-between items-start">
              <span className="text-5xl font-serif text-slate-900">99%</span>
              <span className="material-symbols-outlined text-slate-300">
                verified
              </span>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">High Accuracy</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Precision diagnostics calibrated for local water variants.
              </p>
            </div>
          </div>

          {/* Monitoring Card */}
          <div className="md:col-span-2 bento-item bg-slate-900 text-white group">
            <img
              alt="Monitoring"
              className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:scale-105 transition-transform duration-700"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAflzuNJpIswY7w90ShGKhpPRHzBPjoN8VaBwdWEKGpxu7rHCVwzIN8lzWt8xGXChUDaTiZzvb76w18xlz0lNnJ4YD27KfCs3wR5xS2Jqp5ZpJKTHdgVbFA8pznxjkF0x1DkEJu0-K95JjZUKqSkAItjonGbYRo_Ai1t1_8HSUCc8myB1FHTiDaw31B7k8Vm-fv7zvbIkZpHTEbH2xjk4FUulzViLTM2FEeePgBIW_40WLBE3yJxstJeP9QHXljwK3nrkmnKqF6SfEk"
            />
            <div className="relative z-10 h-full flex flex-col justify-between">
              <div className="flex justify-between">
                <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] uppercase tracking-widest font-bold">
                  Live Data Feed
                </span>
                <span className="material-symbols-outlined text-white/50">
                  sensors
                </span>
              </div>
              <div>
                <h3 className="text-3xl font-serif italic mb-3">
                  Real-time Monitoring
                </h3>
                <p className="text-slate-300 text-sm max-w-xs">
                  Continuous spectral analysis of chemical and biological
                  pathogens across 500+ locations.
                </p>
              </div>
            </div>
          </div>

          {/* AI Prediction Card */}
          <div className="md:col-span-1 bento-item bg-[#F8FAF9]">
            <div className="flex justify-between items-start">
              <div className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center">
                <span className="material-symbols-outlined text-slate-400">
                  psychology
                </span>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">AI Prediction</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Early warning protocols triggered by predictive modeling.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Capabilities;
