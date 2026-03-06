import React from "react";
import { motion } from "framer-motion";

const Footer = () => {
  return (
    <footer className="footer-gradient text-white py-24 px-8 border-t border-white/5 overflow-hidden">
      <div className="max-w-7xl mx-auto text-center relative">
        <motion.h2 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-6xl md:text-8xl font-serif leading-none tracking-tighter mb-10"
        >
          Secure. Safe.
          <br />
          <motion.span 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="italic bg-gradient-to-r from-brand-blue to-brand-teal bg-clip-text text-transparent"
          >
            NeerKavach.
          </motion.span>
        </motion.h2>

        <motion.p 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="text-[10px] text-slate-500 uppercase tracking-widest"
        >
          © 2026 NeerKavach System. Advanced Water Surveillance.
        </motion.p>

        {/* Floating decorative elements */}
        <motion.div
          animate={{ x: [0, 20, 0], y: [0, -10, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-10 -left-20 w-40 h-40 bg-brand-blue/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ x: [0, -20, 0], y: [0, 10, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-10 -right-20 w-60 h-60 bg-brand-teal/10 rounded-full blur-3xl"
        />
      </div>
    </footer>
  );
};

export default Footer;
