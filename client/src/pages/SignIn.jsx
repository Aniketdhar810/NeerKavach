import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../lib/api";
import ThemeToggle from "../components/ThemeToggle";

const SignIn = () => {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });

  const toggleTheme = () => {
    document.documentElement.classList.toggle("dark");
    setDarkMode(!darkMode);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await API.post("/auth/login", form);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/dashboard");
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "No user exists, please sign up"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-screen flex flex-col relative overflow-x-hidden transition-colors duration-300">
      {/* Header */}
      <header className="p-8 flex justify-between items-center max-w-full mx-auto w-full z-10">
        <Link to="/" className="flex items-center gap-2">
          <div className="relative w-8 h-8 flex items-center justify-center">
            <span className="material-symbols-outlined text-primary text-3xl">
              shield
            </span>
            <span className="material-symbols-outlined text-secondary absolute text-sm bottom-0 right-0 fill-current">
              water_drop
            </span>
          </div>
          <div>
            <h1 className="font-bold text-2xl tracking-tight leading-none">
              NeerKavach
            </h1>
            <p className="text-[9px] uppercase tracking-[0.15em] font-semibold text-slate-500 dark:text-slate-400 mt-1">
              Health Surveillance System
            </p>
          </div>
        </Link>

        <ThemeToggle darkMode={darkMode} onToggle={toggleTheme} />
      </header>

      {/* Main */}
      <main className="flex-grow flex items-center justify-center px-4 py-12 z-10">
        <div className="w-full max-w-md">
          <div className="glass-card p-10 md:p-12 rounded-4xl transition-all duration-300">
            <div className="mb-10">
              <h2 className="text-3xl font-bold mb-2 tracking-tight">
                Sign In
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm">
                Official Portal for Water Quality & Risk Prediction
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-slate-500">
                  Official Email Address
                </label>
                <input
                  className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-slate-400"
                  placeholder="name@nic.in"
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) =>
                    setForm({ ...form, email: e.target.value })
                  }
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-slate-500">
                  Password
                </label>
                <input
                  className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-slate-400"
                  placeholder="••••••••"
                  type="password"
                  required
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                />
              </div>

              {/* Remember / Forgot */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary cursor-pointer"
                  />
                  <label className="ml-2 text-sm text-slate-600 dark:text-slate-400">
                    Keep me logged in
                  </label>
                </div>
                <a
                  className="text-sm font-semibold text-primary hover:underline"
                  href="#"
                >
                  Forgot access?
                </a>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary hover:bg-brand-deep text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2 group mt-4"
              >
                {loading ? (
                  <span className="animate-spin material-symbols-outlined">
                    sync
                  </span>
                ) : (
                  <>
                    <span>Authenticate Access</span>
                    <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">
                      arrow_forward
                    </span>
                  </>
                )}
              </button>
            </form>

            {/* Signup link */}
            <p className="text-center text-sm text-slate-500 mt-6">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="font-semibold text-primary hover:underline"
              >
                Create Account
              </Link>
            </p>
          </div>

          {/* Footer branding */}
          <div className="mt-12 text-center space-y-8">
            <div className="flex items-center justify-center gap-5 opacity-80">
              <img
                alt="Government of India emblem"
                className="h-14 dark:invert"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBgZFrePIbRwiQV_ktxBDXVhKP4d4XWvnu6eHz7x1sBshB4Zc-SPQQSGNgjekXIVpwO-iYPL0TuZoF-VmE0jurra2JRcfw9HgxG_vVw6jN7-lj_ZX6BeDvXQLqyeGes_j23Rpk8vm05C98gIelZ2Udz5FqMdctVMaeB3_Qbc6Q2pIPIqWJwBAT7ajQaBUpgB2sNRIQ4aPB_VuLeuLXUzwsbd24Sekx4aSzNCQ0gueuWw6vER9EQ2Xa5CDPw96Y7ktXA-BVKEimW4yD3"
              />
              <div className="text-left border-l border-slate-300 dark:border-slate-700 pl-5">
                <p className="text-[10px] font-bold uppercase text-slate-500">
                  Government of India
                </p>
                <p className="text-[11px] font-extrabold">
                  Ministry of Health & Family Welfare
                </p>
              </div>
            </div>
            <p className="text-[10px] text-slate-400 uppercase tracking-[0.25em] font-bold">
              Secured by National Informatics Centre
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SignIn;
