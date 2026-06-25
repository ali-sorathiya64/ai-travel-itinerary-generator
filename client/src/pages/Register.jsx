import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const Register = () => {
  const [form, setForm] = useState({ userName: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(form.userName, form.email, form.password);
      toast.success("Account created! Check your email for the OTP.");
      navigate("/verify-email", { state: { email: form.email } });
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tc-root">
      <div className="tc-orb tc-orb1"/>
      <div className="tc-orb tc-orb2"/>

      <div className="tc-card">
        {/* Left panel — hidden on mobile */}
        <div className="tc-left">
          <div className="tc-logo">
            <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
              <circle cx="16" cy="16" r="14" stroke="url(#g1r)" strokeWidth="1.5"/>
              <path d="M4 16 Q16 8 28 16 Q16 24 4 16Z" fill="url(#g2r)" opacity="0.55"/>
              <circle cx="16" cy="16" r="3" fill="white"/>
              <defs>
                <linearGradient id="g1r" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse"><stop stopColor="#818CF8"/><stop offset="1" stopColor="#22D3EE"/></linearGradient>
                <linearGradient id="g2r" x1="4" y1="16" x2="28" y2="16" gradientUnits="userSpaceOnUse"><stop stopColor="#818CF8"/><stop offset="1" stopColor="#22D3EE"/></linearGradient>
              </defs>
            </svg>
            <span className="tc-brand">TripCraft</span>
          </div>
          <div className="tc-left-body">
            <h2 className="tc-headline">Your next trip,<br/><span className="tc-grad">planned by AI.</span></h2>
            <p className="tc-tagline">Tell us where you want to go. TripCraft builds a real itinerary around how you travel.</p>
          </div>
          <div className="tc-features">
            {[
              { path:"M9 20l-5.447-2.724A1 1 0 0 1 3 16.382V5.618a1 1 0 0 1 1.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0 0 21 18.382V7.618a1 1 0 0 0-.553-.894L15 4m0 13V4m0 0L9 7", label:"Day-by-day itineraries" },
              { path:"M17.657 16.657L13.414 20.9a1.998 1.998 0 0 1-2.827 0l-4.244-4.243a8 8 0 1 1 11.314 0z M15 11a3 3 0 1 1-6 0 3 3 0 0 1 6 0z", label:"Local spots & hidden gems" },
              { path:"M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z", label:"Fits any budget" },
            ].map((f) => (
              <div key={f.label} className="tc-feat">
                <div className="tc-feat-icon">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d={f.path}/></svg>
                </div>
                <span className="tc-feat-label">{f.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right — form */}
        <div className="tc-right">
          {/* Logo shown only on mobile */}
          <div className="tc-logo tc-logo-mobile">
            <svg width="26" height="26" viewBox="0 0 32 32" fill="none">
              <circle cx="16" cy="16" r="14" stroke="url(#g1rm)" strokeWidth="1.5"/>
              <path d="M4 16 Q16 8 28 16 Q16 24 4 16Z" fill="url(#g2rm)" opacity="0.55"/>
              <circle cx="16" cy="16" r="3" fill="white"/>
              <defs>
                <linearGradient id="g1rm" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse"><stop stopColor="#818CF8"/><stop offset="1" stopColor="#22D3EE"/></linearGradient>
                <linearGradient id="g2rm" x1="4" y1="16" x2="28" y2="16" gradientUnits="userSpaceOnUse"><stop stopColor="#818CF8"/><stop offset="1" stopColor="#22D3EE"/></linearGradient>
              </defs>
            </svg>
            <span className="tc-brand">TripCraft</span>
          </div>

          <h1 className="tc-title">Create account</h1>
          <p className="tc-sub">Free to start. No credit card needed.</p>

          <form onSubmit={handleSubmit} className="tc-form">
            <div className="tc-field">
              <label className="tc-label">Username</label>
              <div className="tc-input-wrap">
                <svg className="tc-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                <input name="userName" type="text" value={form.userName} onChange={handleChange} required placeholder="example_user" className="tc-input"/>
              </div>
            </div>

            <div className="tc-field">
              <label className="tc-label">Email</label>
              <div className="tc-input-wrap">
                <svg className="tc-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="2" y="4" width="20" height="16" rx="3"/><path d="m2 7 10 7 10-7"/></svg>
                <input name="email" type="email" value={form.email} onChange={handleChange} required placeholder="you@example.com" className="tc-input"/>
              </div>
            </div>

            <div className="tc-field">
              <label className="tc-label">Password</label>
              <div className="tc-input-wrap">
                <svg className="tc-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                <input name="password" type={showPw ? "text" : "password"} value={form.password} onChange={handleChange} required minLength={6} placeholder="Min. 6 characters" className="tc-input"/>
                <button type="button" onClick={() => setShowPw(!showPw)} className="tc-eye">
                  {showPw
                    ? <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                    : <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  }
                </button>
              </div>
              <p className="tc-hint">We'll send an OTP to verify your email.</p>
            </div>

            <button type="submit" disabled={loading} className="tc-btn">
              {loading ? <><span className="tc-spinner"/>Creating account...</> : <>Get started <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg></>}
            </button>
          </form>

          <p className="tc-switch">Already have an account? <Link to="/login" className="tc-link">Sign in</Link></p>
          <p className="tc-terms">By registering you agree to our <a href="#" className="tc-terms-link">Terms</a> & <a href="#" className="tc-terms-link">Privacy Policy</a>.</p>
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
        .tc-headline { font-size:28px; font-weight:600; color:rgba(255,255,255,0.9); line-height:1.2; letter-spacing:-0.03em; margin-bottom:12px; }
        .tc-grad { background:linear-gradient(90deg,#818CF8,#22D3EE); -webkit-background-clip:text; -webkit-text-fill-color:transparent; }
        .tc-tagline { font-size:13px; color:rgba(148,163,184,0.6); line-height:1.68; }
        .tc-features { display:flex; flex-direction:column; gap:10px; }
        .tc-feat { display:flex; align-items:center; gap:10px; }
        .tc-feat-icon { width:27px; height:27px; border-radius:7px; background:rgba(129,140,248,0.08); border:1px solid rgba(129,140,248,0.15); display:flex; align-items:center; justify-content:center; color:#818CF8; flex-shrink:0; }
        .tc-feat-label { font-size:12.5px; color:rgba(203,213,225,0.58); }

        .tc-right { flex:1; background:#0D111E; padding:44px 40px; display:flex; flex-direction:column; justify-content:center; }
        .tc-title { font-size:24px; font-weight:600; color:rgba(255,255,255,0.95); letter-spacing:-0.025em; margin-bottom:5px; }
        .tc-sub { font-size:13px; color:rgba(148,163,184,0.5); margin-bottom:26px; }
        .tc-form { display:flex; flex-direction:column; gap:16px; }
        .tc-field { display:flex; flex-direction:column; gap:6px; }
        .tc-label { font-size:12px; font-weight:500; color:rgba(203,213,225,0.7); }
        .tc-input-wrap { position:relative; display:flex; align-items:center; }
        .tc-icon { position:absolute; left:13px; color:rgba(148,163,184,0.38); pointer-events:none; }
        .tc-input { width:100%; padding:11px 13px 11px 40px; border-radius:10px; background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.09); color:rgba(255,255,255,0.9); font-size:14px; font-family:'Inter',sans-serif; transition:border-color 0.15s,box-shadow 0.15s; }
        .tc-input::placeholder { color:rgba(148,163,184,0.4); }
        .tc-input:focus { outline:none; border-color:rgba(129,140,248,0.55); box-shadow:0 0 0 3px rgba(129,140,248,0.1); }
        .tc-eye { position:absolute; right:12px; background:none; border:none; cursor:pointer; color:rgba(148,163,184,0.4); padding:4px; display:flex; align-items:center; }
        .tc-hint { font-size:11px; color:rgba(148,163,184,0.36); }
        .tc-btn { margin-top:4px; padding:12px 24px; border-radius:10px; background:linear-gradient(135deg,#6366F1,#4F46E5 55%,#0EA5E9); border:none; color:white; font-size:14px; font-weight:500; font-family:'Inter',sans-serif; cursor:pointer; box-shadow:0 4px 20px rgba(99,102,241,0.28); display:flex; align-items:center; justify-content:center; gap:8px; transition:all 0.15s; }
        .tc-btn:hover:not(:disabled) { transform:translateY(-1px); opacity:0.91; }
        .tc-btn:disabled { opacity:0.6; cursor:not-allowed; }
        .tc-spinner { width:14px; height:14px; border:2px solid rgba(255,255,255,0.25); border-top-color:white; border-radius:50%; animation:spin 0.7s linear infinite; }
        .tc-switch { margin-top:20px; font-size:13px; color:rgba(148,163,184,0.46); text-align:center; }
        .tc-link { color:#818CF8; text-decoration:none; font-weight:500; }
        .tc-terms { margin-top:9px; font-size:11px; color:rgba(148,163,184,0.28); text-align:center; }
        .tc-terms-link { color:rgba(129,140,248,0.5); text-decoration:none; }

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

export default Register;