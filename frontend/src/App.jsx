import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Home from "./pages/Home";
import PackagesPage from "./pages/PackagesPage";
import PackageDetail from "./pages/PackageDetail";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Flights from "./pages/Flights";
import AdminLoginPage from "./pages/admin/AdminLoginPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import PrivacyPolicy from "./components/UseFullLinks/PrivacyPolicy";
import TermsConditions from "./components/UseFullLinks/TermsNCondition";
import NotFound from "./pages/NotFound";
import ScrollToTop from "./components/ScrollToTop";
export default function App() {
  const location = useLocation();
  const isAdminArea =
    location.pathname === "/admin-login-page" || location.pathname.startsWith("/admin");

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
          <Route path="/contact" element={<Contact />} />
          <Route path="/flights" element={<Flights />} />
          <Route path="/admin-login-page" element={<AdminLoginPage />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route
            path="/privacy-policy"
            element={<PrivacyPolicy />}
          />

          <Route
            path="/terms-conditions"
            element={<TermsConditions />}
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      {!isAdminArea && <Footer />}
    </div>
  );
}
