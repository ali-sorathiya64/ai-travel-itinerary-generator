import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import UploadBox from "../components/UploadBox";
import ItineraryCard from "../components/ItineraryCard";
import Loader from "../components/Loader";
import api from "../api/axios";
import toast from "react-hot-toast";

const Dashboard = () => {
  const [itineraries, setItineraries] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchItineraries = async () => {
    try {
      const { data } = await api.get("/itinerary/my");
      setItineraries(data.data || []);
    } catch (error) {
      toast.error("Could not load your itineraries");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItineraries();
  }, []);

  const handleUploadSuccess = (newItem) => {
    setItineraries((prev) => [newItem, ...prev]);
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/itinerary/${id}`);
      setItineraries((prev) => prev.filter((item) => item._id !== id));
      toast.success("Itinerary deleted");
    } catch (error) {
      toast.error(error.response?.data?.message || "Delete failed");
    }
  };

  return (
    <>
      <Navbar />
      <div className="tc-root">
        <div className="tc-orb tc-orb1" />
        <div className="tc-orb tc-orb2" />

        <div className="tc-card">
          <div className="tc-dashboard-content">
            {/* Header */}
            <div className="tc-header">
              <div className="tc-logo">
                <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
                  <circle cx="16" cy="16" r="14" stroke="url(#g1d)" strokeWidth="1.5" />
                  <path d="M4 16 Q16 8 28 16 Q16 24 4 16Z" fill="url(#g2d)" opacity="0.55" />
                  <circle cx="16" cy="16" r="3" fill="white" />
                  <defs>
                    <linearGradient id="g1d" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#818CF8" /><stop offset="1" stopColor="#22D3EE" />
                    </linearGradient>
                    <linearGradient id="g2d" x1="4" y1="16" x2="28" y2="16" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#818CF8" /><stop offset="1" stopColor="#22D3EE" />
                    </linearGradient>
                  </defs>
                </svg>
                <span className="tc-brand">TripCraft</span>
              </div>
              <div className="tc-user-badge">
                <span className="tc-dot" />
                <span className="tc-pill-text">Dashboard</span>
              </div>
            </div>

            {/* Body */}
            <div className="tc-body">
              {/* Upload section */}
              <div className="tc-section">
                <h1 className="tc-title">Upload a Travel Document</h1>
                <p className="tc-sub">
                  Upload your flight ticket, hotel booking, or travel document —
                  AI will generate your itinerary automatically.
                </p>
              </div>

              <div className="tc-upload-wrapper">
                <UploadBox onUploadSuccess={handleUploadSuccess} />
              </div>

              {/* Itineraries section */}
              <div className="tc-section tc-itineraries">
                <h2 className="tc-section-title">Your Itineraries</h2>

                {loading ? (
                  <Loader text="Fetching your itineraries..." />
                ) : itineraries.length === 0 ? (
                  <div className="tc-empty">
                    No itineraries yet. Upload a document above to get started.
                  </div>
                ) : (
                  <div className="tc-grid">
                    {itineraries.map((item) => (
                      <div key={item._id} className="tc-card-item">
                        <ItineraryCard item={item} onDelete={handleDelete} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');
          *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
          @keyframes spin { to { transform: rotate(360deg); } }
          @keyframes f1 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(20px,-15px)} }
          @keyframes f2 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(-15px,20px)} }

          .tc-root {
            min-height:100vh;
            background:#080C18;
            font-family:'Inter',sans-serif;
            padding: 20px 16px 40px;
            position:relative;
            overflow:hidden;
            display:flex;
            align-items:flex-start;
            justify-content:center;
          }
          .tc-orb {
            position:absolute;
            border-radius:50%;
            pointer-events:none;
          }
          .tc-orb1 {
            top:-10%;
            right:-8%;
            width:420px;
            height:420px;
            background:radial-gradient(circle,rgba(6,182,212,0.13) 0%,transparent 70%);
            animation:f2 16s ease-in-out infinite;
          }
          .tc-orb2 {
            bottom:-15%;
            left:-8%;
            width:380px;
            height:380px;
            background:radial-gradient(circle,rgba(99,102,241,0.14) 0%,transparent 70%);
            animation:f1 20s ease-in-out infinite;
          }

          .tc-card {
            position:relative;
            z-index:1;
            width:100%;
            max-width:880px;
            border-radius:24px;
            overflow:hidden;
            border:1px solid rgba(255,255,255,0.07);
            box-shadow:0 32px 64px rgba(0,0,0,0.5);
            background:#0D111E;
            padding: 36px 40px 40px;
            margin-top: 16px;
          }

          .tc-dashboard-content {
            display:flex;
            flex-direction:column;
            gap: 32px;
          }

          /* Header */
          .tc-header {
            display:flex;
            justify-content:space-between;
            align-items:center;
            padding-bottom:18px;
            border-bottom:1px solid rgba(255,255,255,0.06);
          }
          .tc-logo {
            display:flex;
            align-items:center;
            gap:9px;
          }
          .tc-brand {
            font-size:17px;
            font-weight:600;
            background:linear-gradient(90deg,#818CF8,#22D3EE);
            -webkit-background-clip:text;
            -webkit-text-fill-color:transparent;
            letter-spacing:-0.02em;
          }
          .tc-user-badge {
            display:inline-flex;
            align-items:center;
            gap:8px;
            padding:7px 14px;
            background:rgba(255,255,255,0.04);
            border:1px solid rgba(255,255,255,0.07);
            border-radius:100px;
          }
          .tc-dot {
            width:7px;
            height:7px;
            border-radius:50%;
            background:#34D399;
            box-shadow:0 0 6px rgba(52,211,153,0.6);
            flex-shrink:0;
          }
          .tc-pill-text {
            font-size:12px;
            color:rgba(148,163,184,0.58);
          }

          .tc-body {
            display:flex;
            flex-direction:column;
            gap: 28px;
          }

          .tc-section {
            display:flex;
            flex-direction:column;
            gap: 4px;
          }

          .tc-title {
            font-size:22px;
            font-weight:600;
            color:rgba(255,255,255,0.95);
            letter-spacing:-0.025em;
            margin:0;
          }
          .tc-sub {
            font-size:14px;
            color:rgba(148,163,184,0.55);
            margin:0;
            line-height:1.5;
          }

          .tc-section-title {
            font-size:18px;
            font-weight:500;
            color:rgba(255,255,255,0.85);
            margin: 4px 0 0 0;
          }

          .tc-empty {
            text-align:center;
            padding:48px 0;
            color:rgba(148,163,184,0.4);
            font-size:14px;
          }

          .tc-grid {
            display:grid;
            grid-template-columns:1fr 1fr;
            gap: 18px;
            margin-top: 4px;
          }

          /* ---- Overrides for UploadBox and ItineraryCard ---- */
          .tc-upload-wrapper > * {
            background: rgba(255,255,255,0.025) !important;
            border: 1.5px dashed rgba(255,255,255,0.1) !important;
            border-radius: 14px !important;
            padding: 36px 20px !important;
            text-align: center !important;
            color: rgba(255,255,255,0.7) !important;
            transition: border-color 0.25s, background 0.25s;
          }
          .tc-upload-wrapper > *:hover {
            border-color: rgba(129,140,248,0.35) !important;
            background: rgba(255,255,255,0.04) !important;
          }
          .tc-upload-wrapper input,
          .tc-upload-wrapper button {
            background: rgba(255,255,255,0.06) !important;
            border: 1px solid rgba(255,255,255,0.08) !important;
            color: white !important;
            border-radius: 8px !important;
            padding: 8px 18px !important;
            font-family: 'Inter', sans-serif !important;
            font-size: 13px !important;
          }
          .tc-upload-wrapper button:hover {
            background: rgba(129,140,248,0.15) !important;
          }

          /* Itinerary cards */
          .tc-card-item > * {
            background: rgba(255,255,255,0.035) !important;
            border: 1px solid rgba(255,255,255,0.06) !important;
            border-radius: 14px !important;
            padding: 18px 18px 16px !important;
            color: rgba(255,255,255,0.85) !important;
            transition: transform 0.15s, border-color 0.2s, box-shadow 0.2s;
            height: 100%;
          }
          .tc-card-item > *:hover {
            transform: translateY(-3px);
            border-color: rgba(129,140,248,0.2);
            box-shadow: 0 6px 20px rgba(0,0,0,0.3);
          }
          .tc-card-item h3,
          .tc-card-item .title {
            color: white !important;
            font-weight: 500;
            font-size: 16px;
            margin-bottom: 6px;
          }
          .tc-card-item p,
          .tc-card-item .text-muted {
            color: rgba(148,163,184,0.6) !important;
            font-size: 13px;
            line-height: 1.5;
          }
          .tc-card-item .badge {
            background: rgba(129,140,248,0.12) !important;
            color: #818CF8 !important;
            border-radius: 20px !important;
            padding: 2px 12px !important;
            font-size: 11px;
            font-weight: 500;
            display: inline-block;
          }
          .tc-card-item .delete-btn {
            background: rgba(239,68,68,0.08) !important;
            color: #F87171 !important;
            border: none !important;
            border-radius: 8px !important;
            padding: 4px 14px !important;
            cursor: pointer;
            font-size: 12px;
            transition: background 0.15s;
          }
          .tc-card-item .delete-btn:hover {
            background: rgba(239,68,68,0.18) !important;
          }

          @media (max-width: 640px) {
            .tc-card {
              padding: 20px 16px 24px;
              margin-top: 8px;
            }
            .tc-grid {
              grid-template-columns:1fr;
              gap: 14px;
            }
            .tc-header {
              flex-direction:column;
              align-items:flex-start;
              gap:12px;
            }
            .tc-user-badge {
              align-self:flex-start;
            }
            .tc-title {
              font-size:20px;
            }
            .tc-upload-wrapper > * {
              padding: 24px 16px !important;
            }
          }
        `}</style>
      </div>
    </>
  );
};

export default Dashboard;