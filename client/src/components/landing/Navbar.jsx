import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="fixed top-0 w-full z-50 px-8 py-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="relative w-8 h-8 flex items-center justify-center">
            <span className="material-symbols-outlined text-brand-blue text-3xl">
              shield
            </span>
            <span className="material-symbols-outlined text-brand-teal absolute text-sm bottom-0 right-0 fill-current">
              water_drop
            </span>
          </div>
          <span className="text-xl font-semibold tracking-tight uppercase text-slate-900">
            NeerKavach
          </span>
        </Link>

        {/* Nav Links */}
        <div className="hidden md:flex items-center gap-10 text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
          <a className="hover:text-brand-blue transition-colors" href="#capabilities">
            System
          </a>
          <a className="hover:text-brand-blue transition-colors" href="#capabilities">
            Data Intelligence
          </a>
          <a className="hover:text-brand-blue transition-colors" href="#">
            Network
          </a>
          <a className="hover:text-brand-blue transition-colors" href="#">
            Governance
          </a>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-6">
          <Link
            className="text-xs font-medium uppercase tracking-widest text-slate-900 hover:opacity-60 transition-opacity"
            to="/signin"
          >
            Login
          </Link>

          <Link
            to="/signin"
            className="bg-black text-white px-6 py-2.5 rounded-full text-xs font-medium uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center gap-2 group"
          >
            Analyze Water
            <span className="material-symbols-outlined text-sm group-hover:translate-x-0.5 transition-transform">
              north_east
            </span>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
