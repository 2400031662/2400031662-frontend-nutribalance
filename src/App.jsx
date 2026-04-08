import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Welcome from "./pages/Welcome.jsx";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import PlatformDetails from "./pages/details/PlatformDetails.jsx";
import UserDeepDive from "./pages/details/UserDeepDive.jsx";
import NutritionistDeepDive from "./pages/details/NutritionistDeepDive.jsx";
import UserDashboard from "./pages/dashboards/UserDashboard.jsx";
import NutritionistDashboard from "./pages/dashboards/NutritionistDashboard.jsx";
import AdminDashboard from "./pages/dashboards/AdminDashboard.jsx";
import AdminDeepDive from "./pages/details/AdminDeepDive.jsx";
import UserChat from "./pages/modules/UserChat.jsx";
import UserAiScanner from "./pages/modules/UserAiScanner.jsx";
import UserVideoConsultation from "./pages/modules/UserVideoConsultation.jsx";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Welcome />} />
            <Route path="/home" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/details/:topic" element={<PlatformDetails />} />
            <Route path="/dashboard/user" element={<UserDashboard />} />
            <Route
              path="/dashboard/user/deep-dive/:section"
              element={<UserDeepDive />}
            />
            <Route path="/dashboard/user/chat" element={<UserChat />} />
            <Route
              path="/dashboard/user/ai-scanner"
              element={<UserAiScanner />}
            />
            <Route
              path="/dashboard/user/video-consultation"
              element={<UserVideoConsultation />}
            />
            <Route
              path="/dashboard/nutritionist"
              element={<NutritionistDashboard />}
            />
            <Route
              path="/dashboard/nutritionist/deep-dive/:section"
              element={<NutritionistDeepDive />}
            />
            <Route
              path="/dashboard/nutritionist/deep-dive"
              element={<NutritionistDeepDive />}
            />
            <Route path="/dashboard/admin" element={<AdminDashboard />} />
            <Route
              path="/dashboard/admin/deep-dive/:section"
              element={<AdminDeepDive />}
            />
            <Route
              path="/dashboard/admin/deep-dive"
              element={<AdminDeepDive />}
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
