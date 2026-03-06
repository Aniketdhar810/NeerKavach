import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="relative pt-48 pb-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-8 relative z-10">
        <div className="text-center space-y-12 mb-24">
          {/* Badge */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-slate-200 text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500 bg-white/50 backdrop-blur-sm"
          >
            <span className="w-1.5 h-1.5 bg-brand-blue rounded-full animate-pulse"></span>
            AI-Augmented Surveillance
          </motion.div>

          {/* Heading */}
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-7xl md:text-9xl font-serif text-slate-900 leading-[0.9] tracking-tighter"
          >
            Guardian of <br />
            <motion.span 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.8 }}
              className="italic font-light bg-gradient-to-r from-brand-blue to-brand-teal bg-clip-text text-transparent"
            >
              Every Drop
            </motion.span>
          </motion.h1>

          {/* Subtext */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="max-w-2xl mx-auto text-lg text-slate-500 font-light leading-relaxed"
          >
            Redefining public health safety with high-precision surveillance.
            <br className="hidden md:block" />
            Real-time water diagnostics powered by advanced predictive neural
            networks.
          </motion.p>

          {/* CTA */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="flex justify-center gap-4"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link 
                to="/signin"
                className="bg-black text-white px-10 py-5 rounded-full text-sm font-medium uppercase tracking-widest hover:shadow-2xl hover:shadow-black/20 transition-all inline-block"
              >
                Initialize Scan
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Hero Image */}
        <motion.div 
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="relative w-full max-w-6xl mx-auto aspect-[21/9] rounded-[3rem] overflow-hidden shadow-2xl"
        >
          <motion.img
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.6 }}
            alt="Atmospheric clean water ripple"
            className="w-full h-full object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAbv1Sp9WNlhADA5MeI-3XftsUuf9C8seknfV5Jjx6wqGgBNImTPophzgVyZeqEclY9RIusrKXHgjhuXG5GUJwHDV0-_dBmRel3C1YrN1BXpQ1gmdOWwqrf89847j7b1Ox53UH2lFBJMC4tFGthCw8-4ZqQuWFo0WnGi41CGMdBaUnKvcD4dDlH_ggvxpRFkI77r2gGVZ_yVDmkXwzfKvt4Kk76W03m6eH_3HHJSRgSInzgqZ7IdVCmE4eE-KStfxSZ-_saOzovQNEv"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-light/40 to-transparent"></div>
        </motion.div>
      </div>

      {/* Floating Elements */}
      <motion.div
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-40 left-10 w-20 h-20 bg-brand-blue/10 rounded-full blur-xl"
      />
      <motion.div
        animate={{ y: [0, 20, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-40 right-10 w-32 h-32 bg-brand-teal/10 rounded-full blur-xl"
      />
    </section>
  );
};

export default Hero;
