import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Loader from "../components/Loader";
import api from "../api/axios";
import { FiMapPin, FiHome, FiMap } from "react-icons/fi";
import { format } from "date-fns";

const SharedItinerary = () => {
  const { shareId } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchShared = async () => {
      try {
        const { data } = await api.get(`/itinerary/share/${shareId}`);
        setItem(data.data);
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchShared();
  }, [shareId]);

  if (loading) {
    return (
      <div className="tc-root">
        <div className="tc-loader-wrapper">
          <Loader text="Loading shared itinerary..." />
        </div>
        <style>{`
          .tc-loader-wrapper {
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 60vh;
          }
        `}</style>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="tc-root">
        <div className="tc-error">
          <p>Itinerary not found or link expired.</p>
        </div>
        <style>{`
          .tc-error {
            text-align: center;
            padding: 60px 20px;
            color: rgba(148,163,184,0.6);
            font-size: 16px;
          }
        `}</style>
      </div>
    );
  }

  const data = item.itinerary || {};
  const { title, flight, hotel, summary, confidence, raw } = data;

  return (
    <div className="tc-root">
      <div className="tc-orb tc-orb1" />
      <div className="tc-orb tc-orb2" />

      <div className="tc-card">
        <div className="tc-content">
          {/* Brand header */}
          <div className="tc-brand-header">
            <div className="tc-logo">
              <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
                <circle cx="16" cy="16" r="14" stroke="url(#g1s)" strokeWidth="1.5" />
                <path d="M4 16 Q16 8 28 16 Q16 24 4 16Z" fill="url(#g2s)" opacity="0.55" />
                <circle cx="16" cy="16" r="3" fill="white" />
                <defs>
                  <linearGradient id="g1s" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#818CF8" /><stop offset="1" stopColor="#22D3EE" />
                  </linearGradient>
                  <linearGradient id="g2s" x1="4" y1="16" x2="28" y2="16" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#818CF8" /><stop offset="1" stopColor="#22D3EE" />
                  </linearGradient>
                </defs>
              </svg>
              <span className="tc-brand">TripCraft</span>
            </div>
            <span className="tc-share-badge">Shared</span>
          </div>

          {/* Itinerary detail */}
          <div className="tc-detail-header">
            <h1 className="tc-title">{title || "AI Trip"}</h1>
            {item.createdAt && (
              <p className="tc-date">
                {format(new Date(item.createdAt), "dd MMM yyyy, hh:mm a")}
              </p>
            )}
            {typeof confidence === "number" && (
              <p className="tc-confidence">
                Confidence: {Math.round(confidence * 100)}%
              </p>
            )}
          </div>

          {/* Flight */}
          {flight && (
            <div className="tc-section-box">
              <div className="tc-section-icon">
                <FiMapPin />
              </div>
              <div>
                <h3 className="tc-section-label">Flight</h3>
                <p className="tc-section-text">
                  {typeof flight === "object"
                    ? `${flight.departure || "Unknown"} → ${flight.arrival || "Unknown"}`
                    : flight}
                </p>
              </div>
            </div>
          )}

          {/* Hotel */}
          {hotel && (
            <div className="tc-section-box">
              <div className="tc-section-icon">
                <FiHome />
              </div>
              <div>
                <h3 className="tc-section-label">Hotel</h3>
                <p className="tc-section-text">
                  {typeof hotel === "object" ? hotel.name || "Unknown" : hotel}
                </p>
                {typeof hotel === "object" && hotel.address && (
                  <p className="tc-address">{hotel.address}</p>
                )}
              </div>
            </div>
          )}

          {/* Summary */}
          {summary && (
            <div className="tc-summary">
              <h3 className="tc-section-label">Summary</h3>
              <p className="tc-section-text">{summary}</p>
            </div>
          )}

          {/* Raw data */}
          {raw && (
            <pre className="tc-raw">
              {typeof raw === "object" ? JSON.stringify(raw, null, 2) : raw}
            </pre>
          )}

          {/* Footer note */}
          <p className="tc-footer">Shared via TripCraft — no login required</p>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
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
          max-width:720px;
          border-radius:24px;
          overflow:hidden;
          border:1px solid rgba(255,255,255,0.07);
          box-shadow:0 32px 64px rgba(0,0,0,0.5);
          background:#0D111E;
          padding: 32px 36px 40px;
          margin-top: 16px;
        }

        .tc-content {
          display:flex;
          flex-direction:column;
          gap: 24px;
        }

        .tc-brand-header {
          display:flex;
          justify-content:space-between;
          align-items:center;
          padding-bottom:16px;
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
        .tc-share-badge {
          font-size:11px;
          color:rgba(148,163,184,0.5);
          padding:4px 12px;
          background:rgba(255,255,255,0.04);
          border:1px solid rgba(255,255,255,0.06);
          border-radius:100px;
        }

        .tc-detail-header {
          border-bottom:1px solid rgba(255,255,255,0.06);
          padding-bottom:16px;
        }
        .tc-title {
          font-size:26px;
          font-weight:600;
          color:rgba(255,255,255,0.95);
          letter-spacing:-0.025em;
          margin:0 0 6px 0;
        }
        .tc-date {
          font-size:12px;
          color:rgba(148,163,184,0.4);
          margin:0 0 4px 0;
        }
        .tc-confidence {
          font-size:13px;
          color:#34D399;
          margin:0;
          font-weight:500;
        }

        .tc-section-box {
          display:flex;
          gap:14px;
          background:rgba(255,255,255,0.03);
          border:1px solid rgba(255,255,255,0.06);
          border-radius:12px;
          padding:16px 18px;
          align-items:flex-start;
        }
        .tc-section-icon {
          color:#818CF8;
          font-size:18px;
          margin-top:2px;
        }
        .tc-section-label {
          font-size:13px;
          font-weight:500;
          color:rgba(203,213,225,0.7);
          margin:0 0 4px 0;
        }
        .tc-section-text {
          font-size:14px;
          color:rgba(255,255,255,0.85);
          margin:0;
          line-height:1.5;
        }
        .tc-address {
          font-size:12px;
          color:rgba(148,163,184,0.5);
          margin:4px 0 0 0;
        }

        .tc-summary {
          background:rgba(255,255,255,0.02);
          border-radius:12px;
          padding:16px 18px;
          border-left:3px solid rgba(129,140,248,0.3);
        }
        .tc-summary .tc-section-label {
          margin-bottom:6px;
        }
        .tc-summary .tc-section-text {
          color:rgba(203,213,225,0.7);
          font-size:14px;
          line-height:1.6;
        }

        .tc-raw {
          background:rgba(0,0,0,0.3);
          border-radius:12px;
          padding:16px 18px;
          color:rgba(203,213,225,0.6);
          font-size:12px;
          font-family:'Courier New',monospace;
          overflow:auto;
          white-space:pre-wrap;
          word-break:break-word;
          max-height:300px;
        }

        .tc-footer {
          text-align:center;
          font-size:11px;
          color:rgba(148,163,184,0.3);
          margin-top:4px;
        }

        @media (max-width: 640px) {
          .tc-card {
            padding: 20px 16px 28px;
            margin-top:8px;
          }
          .tc-title {
            font-size:22px;
          }
          .tc-section-box {
            padding:14px 16px;
          }
          .tc-brand-header {
            flex-direction:column;
            align-items:flex-start;
            gap:10px;
          }
        }
      `}</style>
    </div>
  );
};

export default SharedItinerary;