import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Materials from "./pages/Materials";
import MaterialDetail from "./pages/MaterialDetail";
import MaterialUpload from "./components/MaterialUpload";
import Discussions from "./pages/Discussions";
import DiscussionDetail from "./pages/DiscussionDetail";
import CreateDiscussion from "./components/CreateDiscussion";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard";
import AdminUsers from "./components/AdminUsers";
import AdminMaterials from "./components/AdminMaterials";
import UserProfile from "./pages/UserProfile";
import ChangePassword from "./components/ChangePassword";
import UserActivity from "./components/UserActivity";
import NotificationCenter from "./components/NotificationCenter";
import ThemeToggle from "./components/ThemeToggle";
import QuickActions from "./components/QuickActions";
import WelcomeBanner from "./components/WelcomeBanner";

const App: React.FC = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const isDarkMode = localStorage.getItem("theme") === "dark";
    setIsDark(isDarkMode);
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    }
  }, []);

  return (
    <AuthProvider>
      <BrowserRouter>
        <div className={`min-h-screen ${isDark ? "dark" : ""}`}>
          <div className="bg-gray-100 dark:bg-gray-900 min-h-screen">
            <Navbar />
            <main className="py-10">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <WelcomeBanner />
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/materials" element={<Materials />} />
                  <Route path="/materials/:id" element={<MaterialDetail />} />
                  <Route path="/upload" element={<MaterialUpload />} />
                  <Route path="/discussions" element={<Discussions />} />
                  <Route path="/discussions/:id" element={<DiscussionDetail />} />
                  <Route path="/discussions/create" element={<CreateDiscussion />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/admin" element={<AdminDashboard />} />
                  <Route path="/admin/users" element={<AdminUsers />} />
                  <Route path="/admin/materials" element={<AdminMaterials />} />
                  <Route path="/profile" element={<UserProfile />} />
                  <Route path="/profile/password" element={<ChangePassword />} />
                  <Route path="/profile/activity" element={<UserActivity />} />
                  <Route path="/notifications" element={<NotificationCenter />} />
                </Routes>
              </div>
            </main>
          </div>
          <QuickActions />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
