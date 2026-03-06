import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Navbar = () => {
  return (
    <motion.nav 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-0 w-full z-50 px-8 py-6 bg-white/80 backdrop-blur-md"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <motion.div 
            whileHover={{ scale: 1.1, rotate: 5 }}
            className="relative w-8 h-8 flex items-center justify-center"
          >
            <span className="material-symbols-outlined text-brand-blue text-3xl">
              shield
            </span>
            <span className="material-symbols-outlined text-brand-teal absolute text-sm bottom-0 right-0 fill-current">
              water_drop
            </span>
          </motion.div>
          <span className="text-xl font-semibold tracking-tight uppercase text-slate-900">
            NeerKavach
          </span>
        </Link>

        {/* Nav Links */}
        <div className="hidden md:flex items-center gap-10 text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
          {["Surakshit", "Jal", "Swasth", "Kal"].map((item, i) => (
            <motion.a
              key={item}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              whileHover={{ scale: 1.05, color: "#2563eb" }}
              className="hover:text-brand-blue transition-colors cursor-pointer"
              href="#capabilities"
            >
              {item}
            </motion.a>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Link
              className="text-xs font-medium uppercase tracking-widest text-slate-900 hover:opacity-60 transition-opacity"
              to="/signin"
            >
              Login
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              to="/signin"
              className="bg-black text-white px-6 py-2.5 rounded-full text-xs font-medium uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center gap-2 group"
            >
              Analyze Water
              <span className="material-symbols-outlined text-sm group-hover:translate-x-0.5 transition-transform">
                north_east
              </span>
            </Link>
          </motion.div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
