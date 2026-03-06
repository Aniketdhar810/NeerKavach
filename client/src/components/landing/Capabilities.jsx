import React from "react";
import { motion } from "framer-motion";

const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-100px" },
  transition: { duration: 0.6 }
};

const staggerContainer = {
  initial: {},
  whileInView: {
    transition: {
      staggerChildren: 0.15
    }
  },
  viewport: { once: true }
};

const cardVariants = {
  initial: { opacity: 0, y: 30, scale: 0.95 },
  whileInView: { opacity: 1, y: 0, scale: 1 },
  viewport: { once: true },
  transition: { duration: 0.5 }
};

const Capabilities = () => {
  return (
    <section id="capabilities" className="py-32 bg-white">
      <div className="max-w-7xl mx-auto px-8">
        {/* Section Header */}
        <motion.div 
          {...fadeInUp}
          className="mb-20 text-center"
        >
          <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-slate-400 block mb-4">
            Core Capabilities
          </span>
          <h2 className="text-4xl md:text-5xl font-serif text-slate-900 italic">
            Engineered for absolute safety.
          </h2>
        </motion.div>

        {/* Bento Grid */}
        <motion.div 
          variants={staggerContainer}
          initial="initial"
          whileInView="whileInView"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6"
        >
          {/* Accuracy Card */}
          <motion.div 
            variants={cardVariants}
            whileHover={{ y: -8, boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}
            className="md:col-span-1 bento-item bg-slate-50 hover:bg-gradient-to-br hover:from-white hover:to-slate-100 transition-all duration-300"
          >
            <div className="flex justify-between items-start">
              <motion.span 
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="text-5xl font-serif text-slate-900"
              >
                99%
              </motion.span>
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
          </motion.div>

          {/* Monitoring Card */}
          <motion.div 
            variants={cardVariants}
            whileHover={{ y: -8 }}
            className="md:col-span-2 bento-item bg-slate-900 text-white group overflow-hidden"
          >
            <motion.img
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.6 }}
              alt="Monitoring"
              className="absolute inset-0 w-full h-full object-cover opacity-40"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAflzuNJpIswY7w90ShGKhpPRHzBPjoN8VaBwdWEKGpxu7rHCVwzIN8lzWt8xGXChUDaTiZzvb76w18xlz0lNnJ4YD27KfCs3wR5xS2Jqp5ZpJKTHdgVbFA8pznxjkF0x1DkEJu0-K95JjZUKqSkAItjonGbYRo_Ai1t1_8HSUCc8myB1FHTiDaw31B7k8Vm-fv7zvbIkZpHTEbH2xjk4FUulzViLTM2FEeePgBIW_40WLBE3yJxstJeP9QHXljwK3nrkmnKqF6SfEk"
            />
            <div className="relative z-10 h-full flex flex-col justify-between">
              <div className="flex justify-between">
                <motion.span 
                  animate={{ opacity: [0.8, 1, 0.8] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] uppercase tracking-widest font-bold"
                >
                  Live Data Feed
                </motion.span>
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
          </motion.div>

          {/* AI Prediction Card */}
          <motion.div 
            variants={cardVariants}
            whileHover={{ y: -8, boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}
            className="md:col-span-1 bento-item bg-[#F8FAF9] hover:bg-gradient-to-br hover:from-white hover:to-emerald-50 transition-all duration-300"
          >
            <div className="flex justify-between items-start">
              <motion.div 
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
                className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center"
              >
                <span className="material-symbols-outlined text-slate-400">
                  psychology
                </span>
              </motion.div>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">AI Prediction</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Early warning protocols triggered by predictive modeling.
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Capabilities;
