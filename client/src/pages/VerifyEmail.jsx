import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const VerifyEmail = () => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const { verifyEmail, resendOtp } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email || "";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Email missing, please register again");
      return navigate("/register");
    }
    setLoading(true);
    try {
      await verifyEmail(email, otp);
      toast.success("Email verified! You can now log in.");
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email) {
      toast.error("Email missing, please register again");
      return navigate("/register");
    }
    setResending(true);
    try {
      await resendOtp(email);
      toast.success("New OTP sent to your email");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to resend OTP");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="tc-root">
      <div className="tc-orb tc-orb1" />
      <div className="tc-orb tc-orb2" />

      <div className="tc-card">
        {/* Left panel — hidden on mobile */}
        <div className="tc-left">
          <div className="tc-logo">
            <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
              <circle cx="16" cy="16" r="14" stroke="url(#g1v)" strokeWidth="1.5" />
              <path d="M4 16 Q16 8 28 16 Q16 24 4 16Z" fill="url(#g2v)" opacity="0.55" />
              <circle cx="16" cy="16" r="3" fill="white" />
              <defs>
                <linearGradient id="g1v" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#818CF8" /><stop offset="1" stopColor="#22D3EE" />
                </linearGradient>
                <linearGradient id="g2v" x1="4" y1="16" x2="28" y2="16" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#818CF8" /><stop offset="1" stopColor="#22D3EE" />
                </linearGradient>
              </defs>
            </svg>
            <span className="tc-brand">TripCraft</span>
          </div>
          <div className="tc-left-body">
            <div className="tc-verify-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#818CF8" strokeWidth="1.8">
                <path d="M4 4h16v12H4z" />
                <path d="m4 4 8 6 8-6" />
              </svg>
            </div>
            <h2 className="tc-headline">
              Check your inbox<br />
              <span className="tc-grad">Verify your email</span>
            </h2>
            <p className="tc-tagline">
              We sent a 6‑digit code to <strong className="tc-email-highlight">{email}</strong>.
              Enter it below to activate your TripCraft account.
            </p>
          </div>
          <div className="tc-pill">
            <span className="tc-dot" />
            <span className="tc-pill-text">Secure &amp; fast verification</span>
          </div>
        </div>

        {/* Right panel — form */}
        <div className="tc-right">
          {/* Logo shown only on mobile */}
          <div className="tc-logo tc-logo-mobile">
            <svg width="26" height="26" viewBox="0 0 32 32" fill="none">
              <circle cx="16" cy="16" r="14" stroke="url(#g1vm)" strokeWidth="1.5" />
              <path d="M4 16 Q16 8 28 16 Q16 24 4 16Z" fill="url(#g2vm)" opacity="0.55" />
              <circle cx="16" cy="16" r="3" fill="white" />
              <defs>
                <linearGradient id="g1vm" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#818CF8" /><stop offset="1" stopColor="#22D3EE" />
                </linearGradient>
                <linearGradient id="g2vm" x1="4" y1="16" x2="28" y2="16" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#818CF8" /><stop offset="1" stopColor="#22D3EE" />
                </linearGradient>
              </defs>
            </svg>
            <span className="tc-brand">TripCraft</span>
          </div>

          <h1 className="tc-title">Verify email</h1>
          <p className="tc-sub">
            Enter the 6‑digit code we sent to <span className="tc-email-sub">{email}</span>
          </p>

          <form onSubmit={handleSubmit} className="tc-form">
            <div className="tc-field">
              <label className="tc-label">OTP Code</label>
              <div className="tc-input-wrap">
                <svg className="tc-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <rect x="2" y="4" width="20" height="16" rx="3" />
                  <path d="m2 7 10 7 10-7" />
                </svg>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  required
                  maxLength={6}
                  placeholder="••••••"
                  className="tc-input tc-otp-input"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                />
              </div>
            </div>

            <button type="submit" disabled={loading} className="tc-btn">
              {loading ? (
                <><span className="tc-spinner" />Verifying...</>
              ) : (
                <>Verify <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" /></svg>
                </>
              )}
            </button>
          </form>

          <div className="tc-actions">
            <button
              type="button"
              onClick={handleResend}
              disabled={resending}
              className="tc-resend"
            >
              {resending ? "Sending..." : "Didn't receive code? Resend"}
            </button>
          </div>

          <p className="tc-switch">
            Wrong email? <Link to="/register" className="tc-link">Go back</Link>
          </p>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes f1 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(20px,-15px)} }
        @keyframes f2 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(-15px,20px)} }

        .tc-root { min-height:100vh; display:flex; align-items:center; justify-content:center; background:#080C18; font-family:'Inter',sans-serif; padding:16px; position:relative; overflow:hidden; }
        .tc-orb { position:absolute; border-radius:50%; pointer-events:none; }
        .tc-orb1 { top:-10%; right:-8%; width:420px; height:420px; background:radial-gradient(circle,rgba(6,182,212,0.13) 0%,transparent 70%); animation:f2 16s ease-in-out infinite; }
        .tc-orb2 { bottom:-15%; left:-8%; width:380px; height:380px; background:radial-gradient(circle,rgba(99,102,241,0.14) 0%,transparent 70%); animation:f1 20s ease-in-out infinite; }

        .tc-card { position:relative; z-index:1; display:flex; width:100%; max-width:860px; border-radius:20px; overflow:hidden; border:1px solid rgba(255,255,255,0.07); box-shadow:0 32px 64px rgba(0,0,0,0.5); }

        .tc-left { flex:0 0 42%; background:linear-gradient(145deg,#0E1525,#101828); padding:40px 30px; display:flex; flex-direction:column; justify-content:space-between; border-right:1px solid rgba(255,255,255,0.06); }
        .tc-logo { display:flex; align-items:center; gap:9px; }
        .tc-logo-mobile { display:none; margin-bottom:18px; }
        .tc-brand { font-size:17px; font-weight:600; background:linear-gradient(90deg,#818CF8,#22D3EE); -webkit-background-clip:text; -webkit-text-fill-color:transparent; letter-spacing:-0.02em; }
        .tc-left-body { flex:1; display:flex; flex-direction:column; justify-content:center; padding:24px 0; }
        .tc-verify-icon { margin-bottom:20px; width:48px; height:48px; border-radius:12px; background:rgba(129,140,248,0.08); border:1px solid rgba(129,140,248,0.15); display:flex; align-items:center; justify-content:center; color:#818CF8; }
        .tc-headline { font-size:28px; font-weight:600; color:rgba(255,255,255,0.9); line-height:1.2; letter-spacing:-0.03em; margin-bottom:12px; }
        .tc-grad { background:linear-gradient(90deg,#818CF8,#22D3EE); -webkit-background-clip:text; -webkit-text-fill-color:transparent; }
        .tc-tagline { font-size:13px; color:rgba(148,163,184,0.6); line-height:1.68; }
        .tc-email-highlight { color:#818CF8; font-weight:500; }
        .tc-pill { display:inline-flex; align-items:center; gap:8px; padding:7px 13px; background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.07); border-radius:100px; margin-top:12px; align-self:flex-start; }
        .tc-dot { width:7px; height:7px; border-radius:50%; background:#34D399; box-shadow:0 0 6px rgba(52,211,153,0.6); flex-shrink:0; }
        .tc-pill-text { font-size:12px; color:rgba(148,163,184,0.58); }

        .tc-right { flex:1; background:#0D111E; padding:44px 40px; display:flex; flex-direction:column; justify-content:center; }
        .tc-title { font-size:24px; font-weight:600; color:rgba(255,255,255,0.95); letter-spacing:-0.025em; margin-bottom:5px; }
        .tc-sub { font-size:13px; color:rgba(148,163,184,0.5); margin-bottom:26px; }
        .tc-email-sub { color:#818CF8; }
        .tc-form { display:flex; flex-direction:column; gap:16px; }
        .tc-field { display:flex; flex-direction:column; gap:6px; }
        .tc-label { font-size:12px; font-weight:500; color:rgba(203,213,225,0.7); }
        .tc-input-wrap { position:relative; display:flex; align-items:center; }
        .tc-icon { position:absolute; left:13px; color:rgba(148,163,184,0.38); pointer-events:none; }
        .tc-input { width:100%; padding:11px 13px 11px 40px; border-radius:10px; background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.09); color:rgba(255,255,255,0.9); font-size:14px; font-family:'Inter',sans-serif; transition:border-color 0.15s,box-shadow 0.15s; }
        .tc-input::placeholder { color:rgba(148,163,184,0.4); }
        .tc-input:focus { outline:none; border-color:rgba(129,140,248,0.55); box-shadow:0 0 0 3px rgba(129,140,248,0.1); }
        .tc-otp-input { letter-spacing:0.5em; text-align:center; font-size:18px; }
        .tc-btn { margin-top:4px; padding:12px 24px; border-radius:10px; background:linear-gradient(135deg,#6366F1,#4F46E5 55%,#0EA5E9); border:none; color:white; font-size:14px; font-weight:500; font-family:'Inter',sans-serif; cursor:pointer; box-shadow:0 4px 20px rgba(99,102,241,0.28); display:flex; align-items:center; justify-content:center; gap:8px; transition:all 0.15s; }
        .tc-btn:hover:not(:disabled) { transform:translateY(-1px); opacity:0.91; }
        .tc-btn:disabled { opacity:0.6; cursor:not-allowed; }
        .tc-spinner { width:14px; height:14px; border:2px solid rgba(255,255,255,0.25); border-top-color:white; border-radius:50%; animation:spin 0.7s linear infinite; }
        .tc-actions { margin-top:12px; display:flex; justify-content:center; }
        .tc-resend { background:none; border:none; color:rgba(148,163,184,0.5); font-size:12px; font-family:'Inter',sans-serif; cursor:pointer; transition:color 0.15s; text-decoration:underline; }
        .tc-resend:hover:not(:disabled) { color:#818CF8; }
        .tc-resend:disabled { opacity:0.5; cursor:not-allowed; }
        .tc-switch { margin-top:20px; font-size:13px; color:rgba(148,163,184,0.46); text-align:center; }
        .tc-link { color:#818CF8; text-decoration:none; font-weight:500; }

        @media (max-width: 640px) {
          .tc-left { display:none; }
          .tc-logo-mobile { display:flex; }
          .tc-right { padding:28px 20px; }
          .tc-card { border-radius:16px; }
        }
      `}</style>
    </div>
  );
};

export default VerifyEmail;