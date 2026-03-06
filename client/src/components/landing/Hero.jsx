import React from "react";

const Hero = () => {
  return (
    <section className="relative pt-48 pb-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-8 relative z-10">
        <div className="text-center space-y-12 mb-24">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-slate-200 text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500">
            <span className="w-1.5 h-1.5 bg-brand-blue rounded-full animate-pulse"></span>
            AI-Augmented Surveillance
          </div>

          {/* Heading */}
          <h1 className="text-7xl md:text-9xl font-serif text-slate-900 leading-[0.9] tracking-tighter">
            Guardian of <br />
            <span className="italic font-light">Every Drop</span>
          </h1>

          {/* Subtext */}
          <p className="max-w-2xl mx-auto text-lg text-slate-500 font-light leading-relaxed">
            Redefining public health safety with high-precision surveillance.
            <br className="hidden md:block" />
            Real-time water diagnostics powered by advanced predictive neural
            networks.
          </p>

          {/* CTA */}
          <div className="flex justify-center gap-4">
            <button className="bg-black text-white px-10 py-5 rounded-full text-sm font-medium uppercase tracking-widest hover:scale-[1.02] transition-all">
              Initialize Scan
            </button>
          </div>
        </div>

        {/* Hero Image */}
        <div className="relative w-full max-w-6xl mx-auto aspect-[21/9] rounded-[3rem] overflow-hidden shadow-2xl">
          <img
            alt="Atmospheric clean water ripple"
            className="w-full h-full object-cover scale-110"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAbv1Sp9WNlhADA5MeI-3XftsUuf9C8seknfV5Jjx6wqGgBNImTPophzgVyZeqEclY9RIusrKXHgjhuXG5GUJwHDV0-_dBmRel3C1YrN1BXpQ1gmdOWwqrf89847j7b1Ox53UH2lFBJMC4tFGthCw8-4ZqQuWFo0WnGi41CGMdBaUnKvcD4dDlH_ggvxpRFkI77r2gGVZ_yVDmkXwzfKvt4Kk76W03m6eH_3HHJSRgSInzgqZ7IdVCmE4eE-KStfxSZ-_saOzovQNEv"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-light/40 to-transparent"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
