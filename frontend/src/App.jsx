import { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import PackagesPage from "./pages/PackagesPage";
import PackageDetail from "./pages/PackageDetail";
import BlogPage from "./pages/BlogPage";
import Contact from "./pages/Contact";
import Flights from "./pages/Flights";
import AdminLoginPage from "./pages/admin/AdminLoginPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import BlogDetail from "./pages/BlogDetail";
import PrivacyPolicy from "./components/UseFullLinks/PrivacyPolicy";
import TermsConditions from "./components/UseFullLinks/TermsNCondition";
import NotFound from "./pages/NotFound";
import ScrollToTop from "./components/ScrollToTop";

export default function App() {
  const location = useLocation();

  useEffect(() => {
    const pingBackend = async () => {
      try {
        // Use the simpler /health endpoint (no MongoDB check) for faster wakeups
        // Fall back to /api/health if needed; ensure VITE_API_URL is set in your env
        const url = import.meta.env.VITE_API_URL
          ? `${import.meta.env.VITE_API_URL}/health`
          : "/api/health";

        const controller = new AbortController();
        // 10-second timeout so a hung request doesn't block future pings
        const timeoutId = setTimeout(() => controller.abort(), 10000);

        const response = await fetch(url, {
          method: "GET",
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        // Log non-200 responses for debugging but don't treat as failure
        if (!response.ok) {
          console.warn(`Health check returned status: ${response.status}`);
        }
      } catch (error) {
        // Log the error so you can debug if pings are failing
        // This prevents the silent ".catch(() => {})" anti-pattern
        console.debug("Health check ping failed:", error);
      }
    };

    pingBackend();

    const intervalId = setInterval(pingBackend, 10 * 60 * 1000);

    return () => clearInterval(intervalId);
  }, []);

  const isAdminArea =
    location.pathname === "/admin-login-page" ||
    location.pathname.startsWith("/admin");

  return (
    <div className="app-shell">
      <ScrollToTop />
      {!isAdminArea && <Navbar />}

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/packages" element={<PackagesPage />} />
          <Route path="/packages/:id" element={<PackageDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="/blog/:slug" element={<BlogDetail />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/flights" element={<Flights />} />
          <Route path="/admin-login-page" element={<AdminLoginPage />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-conditions" element={<TermsConditions />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {!isAdminArea && <Footer />}
    </div>
  );
}