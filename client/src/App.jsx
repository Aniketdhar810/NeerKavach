import { Routes, Route, Navigate } from "react-router-dom";
import Signup from "./pages/Signup";
import SignIn from "./pages/SignIn";
import Dashboard from "./pages/dashboard";
import LandingPage from "./pages/LandingPage";
import SubmitTest from "./pages/SubmitTest";
import Alerts from "./pages/Alerts";
import Blogs from "./pages/Blogs";
import PredictionResult from "./pages/PredictionResult";
import HotspotMap from "./pages/HotspotMap";
import MyReports from "./pages/MyReports";

// Auth guard: redirect to /signin if not logged in
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/signin" replace />;
};

// Role guard: only allow reporters
const ReporterRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/signin" replace />;
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  if (user.role !== "reporter") return <Navigate to="/dashboard" replace />;
  return children;
};

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/login" element={<SignIn />} />
      <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      <Route path="/submit-test" element={<ReporterRoute><SubmitTest /></ReporterRoute>} />
      <Route path="/prediction-result" element={<PrivateRoute><PredictionResult /></PrivateRoute>} />
      <Route path="/hotspot-map" element={<PrivateRoute><HotspotMap /></PrivateRoute>} />
      <Route path="/my-reports" element={<PrivateRoute><MyReports /></PrivateRoute>} />
      <Route path="/alerts" element={<PrivateRoute><Alerts /></PrivateRoute>} />
      <Route path="/blogs" element={<PrivateRoute><Blogs /></PrivateRoute>} />
    </Routes>
  );
}

export default App;