import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

const Icons = {
  Pharmacy: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
  ),
  Location: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
  ),
  Phone: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
  ),
  Email: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
  ),
  User: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
  ),
  Menu: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12" /><line x1="4" x2="20" y1="6" y2="6" /><line x1="4" x2="20" y1="18" y2="18" /></svg>
  ),
  Close: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
  ),
  Check: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
  )
};

function App() {
  // 1. STATE DEFINITIONS
  const [formData, setFormData] = useState({
    pharmacy_name: "",
    address: "",
    contact_person: "",
    contact_phone: "",
    email_address: "",
  });

  const [currentView, setCurrentView] = useState("form");
  const [countdown, setCountdown] = useState(1);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // 2. HELPERS
  const formatUSPhoneNumber = (value) => {
    const digits = value.replace(/\D/g, "");
    if (digits.length === 0) return "";
    let num = digits[0] !== "1" ? "1" + digits : digits;
    num = num.substring(0, 11);
    const parts = { country: num.slice(0, 1), area: num.slice(1, 4), mid: num.slice(4, 7), last: num.slice(7, 11) };
    if (num.length <= 1) return parts.country;
    if (num.length <= 4) return `${parts.country} (${parts.area}`;
    if (num.length <= 7) return `${parts.country} (${parts.area}) ${parts.mid}`;
    return `${parts.country} (${parts.area}) ${parts.mid}-${parts.last}`;
  };

  // 3. EFFECTS
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

useEffect(() => {
  let timer;
  if (currentView === "success") {
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000); // 1000ms = 1 real second per tick
    } else {
      window.location.href = "https://impactrxreverse.com/";
    }
  }
  return () => clearInterval(timer);
}, [currentView, countdown]);

  // 4. HANDLERS
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "contact_phone") {
      setFormData({ ...formData, [name]: formatUSPhoneNumber(value) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  // ── Phone validation: must be fully formatted (e.g. "1 (123) 456-7890" = 16 chars)
  if (formData.contact_phone) {
    const digits = formData.contact_phone.replace(/\D/g, "");
    if (digits.length < 11) {
      setIsError(true);
      setMessage("Please enter a complete phone number.");
      return;
    }
  }

  // ── Email domain validation: must have a dot after the @
  const emailParts = formData.email_address.split("@");
  if (emailParts.length !== 2 || !emailParts[1].includes(".") || emailParts[1].endsWith(".")) {
    setIsError(true);
    setMessage("Please enter a valid email address.");
    return;
  }

  // ── Clear any previous error and proceed
  setIsError(false);
  setMessage("");
  setLoading(true);

  setCurrentView("success");
  setCountdown(3);
  setMessage("We have received your registration. Our team will review your details and get back to you shortly.");

  try {
    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));
    await axios.post("https://corerxregistration.impactprotech.host/api/register.php", data);
  } catch (error) {
    console.error("Registration background error:", error);
  } finally {
    setLoading(false);
  }
};

  const handleBackToHome = () => { window.location.href = "https://impactrxreverse.com/"; };

  return (
    <div className="registration-page">
      <header className="top-bar">
        <div className="container">
          <div className="contact-info"><span>📞 800-482-9280</span><span>✉️ info@impactrxreverse.com</span></div>
          <div className="social-links"><span>Linked <b>in</b></span></div>
        </div>
      </header>

      <nav className={`main-nav ${scrolled ? "scrolled" : ""}`}>
        <div className="container">
          <a href="https://corerxreturns.com/" className="logo">
          <img src="/logo.jpg" alt="ImpactRx Reverse" className="logo-img" />
            <div className="logo-text"><span className="brand-name">ImpactRx</span><span className="brand-sub">Reverse</span></div>
          </a>
          <button className="mobile-menu-btn" onClick={() => setIsMenuOpen(!isMenuOpen)}><Icons.Menu /></button>
          <ul className={`nav-links ${isMenuOpen ? "active" : ""}`}>
            <li onClick={() => window.location.href="https://corerxreturns.com/"}>Home</li>
            <li onClick={() => window.location.href="https://corerxreturns.com/about-us"}>About Us</li>
                       <li onClick={() => window.location.href ="https://corerxreturns.com/services"}>Services
            </li>
            <li onClick={() =>window.location.href ="https://corerxreturns.com/contact-us"}>
              Contact Us
            </li>
                        <li
              className="login-btn"
              onClick={() => window.location.href ="https://medrxlinkconnect.com/"}
            >
              Login →
            </li>
          </ul>
        </div>
      </nav>

      <main className="hero-section">
        <div className="container">
          {currentView === "form" ? (
            <div className="form-card">
              <button className="close-form-btn" onClick={handleBackToHome}><Icons.Close /></button>
              <h2>Event Registration</h2>
              <p className="subtitle">Fill out the details below to get started</p>

              <form onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group half">
                    <label>Pharmacy Name</label>
                    <div className="input-wrapper">
                      <span className="input-icon"><Icons.Pharmacy /></span>
                      <input type="text" name="pharmacy_name" placeholder="ex. My Pharmacy" value={formData.pharmacy_name} onChange={handleChange} required />
                    </div>
                  </div>
                  <div className="form-group half">
                    <label>Business Address</label>
                    <div className="input-wrapper">
                      <span className="input-icon"><Icons.Location /></span>
                      <input type="text" name="address" placeholder="ex. 123 Main St, Boston, MA 0210" value={formData.address} onChange={handleChange} required />
                    </div>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group half">
                    <label>Contact Person</label>
                    <div className="input-wrapper">
                      <span className="input-icon"><Icons.User /></span>
                      <input type="text" name="contact_person" placeholder="Please indicate the full name" value={formData.contact_person} onChange={handleChange} required />
                    </div>
                  </div>
                  <div className="form-group half">
                    <label>Contact Phone</label>
                    <div className="input-wrapper">
                      <span className="input-icon"><Icons.Phone /></span>
                      <input type="tel" name="contact_phone" placeholder="ex. 1234567890" value={formData.contact_phone} onChange={handleChange} />
                    </div>
                  </div>
                </div>

                <div className="form-group full">
                  <label>Email Address</label>
                  <div className="input-wrapper">
                    <span className="input-icon"><Icons.Email /></span>
                    <input type="email" name="email_address" placeholder="ex. pharmacy@gmail.com" value={formData.email_address} onChange={handleChange} required />
                  </div>
                </div>

                <button type="submit" className={`submit-btn ${loading ? "processing" : ""}`} disabled={loading}>
                  {loading ? "Processing..." : "Submit Registration"}
                </button>
              </form>

              {message && <div className={`status-message ${isError ? "error" : "success"}`}>{message}</div>}
            </div>
          ) : (
 <div className="success-card-overlay">
    <div className="success-message-card">
      <div className="success-icon-container">
        <Icons.Check />
      </div>
      <h3>Thank you for your registration.</h3>
      <p>{message || "We will get back to you after the event."}</p>
      <div className="redirect-footer">
        Redirecting in <span>{countdown}</span> seconds...
      </div>
    </div>
  </div>
)}
        </div>
      </main>
    </div>
  );
}

export default App;