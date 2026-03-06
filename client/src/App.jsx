import { Routes, Route } from "react-router-dom";
import Signup from "./pages/Signup";
import SignIn from "./pages/SignIn";
import Dashboard from "./pages/dashboard";
import LandingPage from "./pages/LandingPage";
import SubmitTest from "./pages/SubmitTest";
import PredictionResult from "./pages/PredictionResult";
import HotspotMap from "./pages/HotspotMap";
import MyReports from "./pages/MyReports";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/login" element={<SignIn />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/submit-test" element={<SubmitTest />} />
      <Route path="/prediction-result" element={<PredictionResult />} />
      <Route path="/hotspot-map" element={<HotspotMap />} />
      <Route path="/my-reports" element={<MyReports />} />
    </Routes>
  );
}

export default App;