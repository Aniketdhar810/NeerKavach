import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import API from "../lib/api";

const Signup = () => {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: "",
    email: "",
    department: "",
    region: "",
    password: "",
    code: "",
    role: "user",
  });

  const toggleTheme = () => {
    const html = document.documentElement;
    if (darkMode) {
      html.classList.remove("dark");
      html.classList.add("light");
    } else {
      html.classList.remove("light");
      html.classList.add("dark");
    }
    setDarkMode(!darkMode);
  };

  const handleSendCode = async () => {
    setLoading(true);
    try {
      await API.post("/auth/send-code", { email: form.email });
      alert("Verification code sent to your email!");
      setStep(2);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to send code");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    setLoading(true);
    try {
      await API.post("/auth/verify-code", {
        email: form.email,
        code: form.code,
      });
      alert("Email verified!");
      setStep(3);
    } catch (err) {
      alert(err.response?.data?.message || "Invalid code");
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async () => {
    setLoading(true);
    try {
      await API.post("/auth/complete-signup", {
        email: form.email,
        username: form.name,
        password: form.password,
        role: form.role,
        department: form.department,
        region: form.region,
      });
      alert("Account created successfully!");
      navigate("/signin");
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (step === 1) handleSendCode();
    else if (step === 2) handleVerify();
    else handleSignup();
  };

  const update = (field) => (e) =>
    setForm({ ...form, [field]: e.target.value });

  const formVariants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 }
  };

  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-screen flex flex-col pattern-bg transition-colors duration-300 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ x: [0, 50, 0], y: [0, -30, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-brand-blue/20 to-brand-teal/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ x: [0, -30, 0], y: [0, 50, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-brand-teal/20 to-brand-blue/10 rounded-full blur-3xl"
        />
      </div>

      {/* Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="p-6 flex justify-between items-center max-w-7xl mx-auto w-full z-10"
      >
        <Link to="/" className="flex items-center gap-3">
          <motion.div 
            whileHover={{ scale: 1.1, rotate: 5 }}
            className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-600/30 relative"
          >
            <span className="material-symbols-outlined text-3xl">shield</span>
            <span className="material-symbols-outlined text-xs absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[40%] text-white opacity-90">
              water_drop
            </span>
          </motion.div>
          <div>
            <h1 className="font-bold text-2xl tracking-tight text-blue-600 dark:text-blue-400 leading-none">
              NeerKavach
            </h1>
            <p className="text-[10px] uppercase tracking-[0.2em] font-bold opacity-60 mt-1">
              Indian Public Health Authority
            </p>
          </div>
        </Link>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
          onClick={toggleTheme}
        >
          <span className="material-symbols-outlined">
            {darkMode ? "light_mode" : "dark_mode"}
          </span>
        </motion.button>
      </motion.header>

      {/* Main */}
      <main className="flex-grow flex items-center justify-center px-4 py-8 z-10">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-full max-w-xl"
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="glass-morphism p-8 md:p-10 rounded-[2rem] shadow-2xl transition-all duration-300 backdrop-blur-xl bg-white/80 dark:bg-slate-800/80 border border-white/20"
          >
            {/* Title */}
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-2 tracking-tight">
                Official Registration
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                Health Official Onboarding for Water Quality Surveillance &
                Disease Risk Prediction
              </p>

              {/* Step indicator */}
              <div className="flex items-center justify-center gap-2 mt-4">
                {[1, 2, 3].map((s) => (
                  <div key={s} className="flex items-center gap-2">
                    <motion.div
                      initial={{ scale: 0.8 }}
                      animate={{ scale: step >= s ? 1 : 0.8 }}
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                        step >= s
                          ? "bg-blue-600 text-white"
                          : "bg-slate-200 dark:bg-slate-700 text-slate-400"
                      }`}
                    >
                      {step > s ? (
                        <span className="material-symbols-outlined text-sm">
                          check
                        </span>
                      ) : (
                        s
                      )}
                    </motion.div>
                    {s < 3 && (
                      <motion.div
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: step > s ? 1 : 0.3 }}
                        className={`w-8 h-0.5 origin-left ${
                          step > s
                            ? "bg-blue-600"
                            : "bg-slate-200 dark:bg-slate-700"
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>
              <p className="text-xs text-slate-400 mt-2">
                {step === 1 && "Step 1: Fill your details & verify email"}
                {step === 2 && "Step 2: Enter verification code"}
                {step === 3 && "Step 3: Set your password"}
              </p>
            </div>

            {/* Form */}
            <form className="space-y-5" onSubmit={handleSubmit}>
              <AnimatePresence mode="wait">
              {/* Step 1: Name, Email, Department, Region */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  variants={formVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                  className="space-y-5"
                >
                  {/* Role Selection */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold">I am registering as</label>
                    <div className="grid grid-cols-2 gap-3">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="button"
                        onClick={() => setForm({ ...form, role: "reporter" })}
                        className={`p-4 rounded-xl border-2 transition-all text-center ${
                          form.role === "reporter"
                            ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                            : "border-slate-200 dark:border-slate-700 hover:border-slate-300"
                        }`}
                      >
                        <span className="material-symbols-outlined text-2xl mb-1 block">
                          assignment_ind
                        </span>
                        <p className="font-bold text-sm">Reporter</p>
                        <p className="text-[10px] text-slate-400 mt-1">ASHA worker / Health authority</p>
                      </motion.button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold">
                        Full Name
                      </label>
                      <div className="relative">
                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                          person
                        </span>
                        <input
                          className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                          placeholder="Dr. Rajesh Kumar"
                          value={form.name}
                          onChange={update("name")}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-semibold">
                        Official Email Address
                      </label>
                      <div className="relative">
                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                          mail
                        </span>
                        <input
                          type="email"
                          className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                          placeholder="official.name@nic.in"
                          value={form.email}
                          onChange={update("email")}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold">
                        Department / Authority
                      </label>
                      <div className="relative">
                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                          account_balance
                        </span>
                        <input
                          className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                          placeholder="Public Health Dept"
                          value={form.department}
                          onChange={update("department")}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-semibold">
                        Region / District
                      </label>
                      <div className="relative">
                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                          location_on
                        </span>
                        <input
                          className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                          placeholder="New Delhi Central"
                          value={form.region}
                          onChange={update("region")}
                          required
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Verification Code */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  variants={formVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                  className="space-y-2"
                >
                  <label className="block text-sm font-semibold">
                    Verification Code
                  </label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                      pin
                    </span>
                    <input
                      className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-center text-2xl tracking-[0.5em]"
                      placeholder="••••••"
                      value={form.code}
                      onChange={update("code")}
                      required
                    />
                  </div>
                  <p className="text-xs text-slate-400 text-center mt-2">
                    We sent a code to{" "}
                    <span className="font-semibold text-slate-600 dark:text-slate-300">
                      {form.email}
                    </span>
                  </p>
                </motion.div>
              )}

              {/* Step 3: Create Password */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  variants={formVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                  className="space-y-2"
                >
                  <label className="block text-sm font-semibold">
                    Create Password
                  </label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                      lock
                    </span>
                    <input
                      type="password"
                      className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                      placeholder="••••••••"
                      value={form.password}
                      onChange={update("password")}
                      required
                    />
                  </div>
                </motion.div>
              )}
              </AnimatePresence>

              {/* Submit Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-600/25 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <span className="animate-spin material-symbols-outlined">
                    sync
                  </span>
                ) : (
                  <>
                    <span>
                      {step === 1 && "Verify Email"}
                      {step === 2 && "Confirm Code"}
                      {step === 3 && "Create Account"}
                    </span>
                    <span className="material-symbols-outlined">
                      {step === 3 ? "how_to_reg" : "arrow_forward"}
                    </span>
                  </>
                )}
              </motion.button>
            </form>

            {/* Sign In Link */}
            <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-700 text-center">
              <p className="text-sm text-slate-500">
                Already have an account?
                <Link
                  to="/signin"
                  className="font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 ml-1"
                >
                  Sign In
                </Link>
              </p>
            </div>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
};

export default Signup;