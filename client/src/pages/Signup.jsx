import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../lib/api";

export default function Signup() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    email: "",
    code: "",
    username: "",
    password: "",
  });

  const handleSendCode = async () => {
    await API.post("/auth/send-code", { email: form.email });
    alert("Verification code sent!");
    setStep(2);
  };

  const handleVerify = async () => {
    await API.post("/auth/verify-code", {
      email: form.email,
      code: form.code,
    });
    alert("Email verified!");
    setStep(3);
  };

  const handleSignup = async () => {
    await API.post("/auth/complete-signup", {
      email: form.email,
      username: form.username,
      password: form.password,
    });

    alert("Account created!");
    navigate("/login");
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2>Create Account</h2>

        <input
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          style={styles.input}
        />

        {step === 1 && (
          <button style={styles.button} onClick={handleSendCode}>
            Send Code
          </button>
        )}

        {step >= 2 && (
          <>
            <input
              placeholder="Verification Code"
              value={form.code}
              onChange={(e) => setForm({ ...form, code: e.target.value })}
              style={styles.input}
            />
            {step === 2 && (
              <button style={styles.button} onClick={handleVerify}>
                Verify Code
              </button>
            )}
          </>
        )}

        {step === 3 && (
          <>
            <input
              placeholder="Username"
              value={form.username}
              onChange={(e) =>
                setForm({ ...form, username: e.target.value })
              }
              style={styles.input}
            />

            <input
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
              style={styles.input}
            />

            <button style={styles.button} onClick={handleSignup}>
              Create Account
            </button>
          </>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f4f6f9",
  },
  card: {
    background: "#fff",
    padding: "40px",
    borderRadius: "12px",
    width: "350px",
    boxShadow: "0 5px 20px rgba(0,0,0,0.1)",
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  input: {
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ddd",
  },
  button: {
    padding: "10px",
    borderRadius: "8px",
    border: "none",
    background: "#4f46e5",
    color: "#fff",
    cursor: "pointer",
  },
};