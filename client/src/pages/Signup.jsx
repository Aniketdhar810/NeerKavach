import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
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

  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-screen flex flex-col pattern-bg transition-colors duration-300">
      {/* Header */}
      <header className="p-6 flex justify-between items-center max-w-7xl mx-auto w-full">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-600/30 relative">
            <span className="material-symbols-outlined text-3xl">shield</span>
            <span className="material-symbols-outlined text-xs absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[40%] text-white opacity-90">
              water_drop
            </span>
          </div>
          <div>
            <h1 className="font-bold text-2xl tracking-tight text-blue-600 dark:text-blue-400 leading-none">
              NeerKavach
            </h1>
            <p className="text-[10px] uppercase tracking-[0.2em] font-bold opacity-60 mt-1">
              Indian Public Health Authority
            </p>
          </div>
        </Link>

        <button
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
          onClick={toggleTheme}
        >
          <span className="material-symbols-outlined">
            {darkMode ? "light_mode" : "dark_mode"}
          </span>
        </button>
      </header>

      {/* Main */}
      <main className="flex-grow flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-xl">
          <div className="glass-morphism p-8 md:p-10 rounded-[2rem] shadow-2xl transition-all duration-300">
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
                    <div
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
                    </div>
                    {s < 3 && (
                      <div
                        className={`w-8 h-0.5 ${
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
              {/* Step 1: Name, Email, Department, Region */}
              {step === 1 && (
                <>
                  {/* Role Selection */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold">I am registering as</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setForm({ ...form, role: "user" })}
                        className={`p-4 rounded-xl border-2 transition-all text-center ${
                          form.role === "user"
                            ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                            : "border-slate-200 dark:border-slate-700 hover:border-slate-300"
                        }`}
                      >
                        <span className="material-symbols-outlined text-2xl mb-1 block">
                          person
                        </span>
                        <p className="font-bold text-sm">Common User</p>
                        <p className="text-[10px] text-slate-400 mt-1">View reports & maps</p>
                      </button>
                      <button
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
                      </button>
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
                </>
              )}

              {/* Step 2: Verification Code */}
              {step === 2 && (
                <div className="space-y-2">
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
                </div>
              )}

              {/* Step 3: Create Password */}
              {step === 3 && (
                <div className="space-y-2">
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
                </div>
              )}

              {/* Submit Button */}
              <button
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
              </button>
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
          </div>
        </div>
      </main>
    </div>
  );
};

export default Signup;