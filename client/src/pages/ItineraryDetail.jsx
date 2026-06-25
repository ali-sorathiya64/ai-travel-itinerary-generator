import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Loader from "../components/Loader";
import api from "../api/axios";
import toast from "react-hot-toast";
import { FiArrowLeft, FiCopy, FiMapPin, FiHome, FiDownload } from "react-icons/fi";
import { format } from "date-fns";
import jsPDF from "jspdf";

const ItineraryDetail = () => {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const { data } = await api.get("/itinerary/my");
        const found = data.data?.find((i) => i._id === id);
        if (!found) {
          toast.error("Itinerary not found");
        }
        setItem(found || null);
      } catch (error) {
        toast.error("Could not load itinerary");
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
  }, [id]);

  const handleCopyShare = () => {
    const url = `${window.location.origin}/share/${item.shareId}`;
    navigator.clipboard.writeText(url);
    toast.success("Share link copied!");
  };

  const handleDownloadPDF = () => {
    if (!item) return;
    setDownloading(true);
    try {
      const data = item.itinerary || {};
      const { title, flight, hotel, summary, confidence, raw } = data;

      const doc = new jsPDF({ unit: "pt", format: "a4" });
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 50;
      const maxWidth = pageWidth - margin * 2;
      let y = 60;

      const addSpacing = (amount = 20) => { y += amount; };
      const checkPageBreak = (neededHeight = 20) => {
        const pageHeight = doc.internal.pageSize.getHeight();
        if (y + neededHeight > pageHeight - margin) {
          doc.addPage();
          y = 60;
        }
      };

      doc.setFont("helvetica", "bold");
      doc.setFontSize(20);
      doc.setTextColor(30, 30, 30);
      doc.text(title || "AI Trip Itinerary", margin, y);
      addSpacing(20);

      if (item.createdAt) {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.setTextColor(120, 120, 120);
        doc.text(
          format(new Date(item.createdAt), "dd MMM yyyy, hh:mm a"),
          margin,
          y
        );
        addSpacing(20);
      }

      if (typeof confidence === "number") {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(11);
        doc.setTextColor(34, 139, 34);
        doc.text(`Confidence: ${Math.round(confidence * 100)}%`, margin, y);
        addSpacing(25);
      }

      if (flight) {
        checkPageBreak(40);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(13);
        doc.setTextColor(79, 70, 229);
        doc.text("Flight", margin, y);
        addSpacing(18);

        const flightText =
          typeof flight === "object"
            ? `${flight.departure || "Unknown"} -> ${flight.arrival || "Unknown"}`
            : String(flight);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(11);
        doc.setTextColor(40, 40, 40);
        const flightLines = doc.splitTextToSize(flightText, maxWidth);
        doc.text(flightLines, margin, y);
        addSpacing(flightLines.length * 14 + 15);
      }

      if (hotel) {
        checkPageBreak(40);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(13);
        doc.setTextColor(79, 70, 229);
        doc.text("Hotel", margin, y);
        addSpacing(18);

        const hotelText =
          typeof hotel === "object" ? hotel.name || "Unknown" : String(hotel);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(11);
        doc.setTextColor(40, 40, 40);
        const hotelLines = doc.splitTextToSize(hotelText, maxWidth);
        doc.text(hotelLines, margin, y);
        addSpacing(hotelLines.length * 14 + 15);
      }

      if (summary) {
        checkPageBreak(40);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(13);
        doc.setTextColor(50, 50, 50);
        doc.text("Summary", margin, y);
        addSpacing(18);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(11);
        doc.setTextColor(60, 60, 60);
        const summaryLines = doc.splitTextToSize(String(summary), maxWidth);

        summaryLines.forEach((line) => {
          checkPageBreak(16);
          doc.text(line, margin, y);
          y += 14;
        });
        addSpacing(15);
      }

      if (raw) {
        checkPageBreak(40);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        doc.setTextColor(50, 50, 50);
        doc.text("Additional Details", margin, y);
        addSpacing(16);

        const rawText =
          typeof raw === "object" ? JSON.stringify(raw, null, 2) : String(raw);

        doc.setFont("courier", "normal");
        doc.setFontSize(9);
        doc.setTextColor(80, 80, 80);
        const rawLines = doc.splitTextToSize(rawText, maxWidth);

        rawLines.forEach((line) => {
          checkPageBreak(12);
          doc.text(line, margin, y);
          y += 12;
        });
      }

      const safeTitle = (title || "itinerary")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

      doc.save(`${safeTitle || "itinerary"}.pdf`);
      toast.success("PDF downloaded!");
    } catch (error) {
      toast.error("Could not generate PDF");
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="tc-root">
        <Navbar />
        <div className="tc-loader-wrapper">
          <Loader text="Loading itinerary..." />
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

  if (!item) {
    return (
      <div className="tc-root">
        <Navbar />
        <div className="tc-not-found">
          <p>Itinerary not found</p>
          <Link to="/dashboard" className="tc-link">Go back</Link>
        </div>
        <style>{`
          .tc-not-found {
            text-align: center;
            padding: 60px 20px;
            color: rgba(148,163,184,0.6);
          }
          .tc-not-found p {
            font-size: 18px;
            margin-bottom: 12px;
          }
          .tc-link {
            color: #818CF8;
            text-decoration: none;
            font-weight: 500;
          }
          .tc-link:hover {
            text-decoration: underline;
          }
        `}</style>
      </div>
    );
  }

  const data = item.itinerary || {};
  const { title, flight, hotel, summary, confidence, raw } = data;

  return (
    <>
      <Navbar />
      <div className="tc-root">
        <div className="tc-orb tc-orb1" />
        <div className="tc-orb tc-orb2" />

        <div className="tc-card">
          <div className="tc-content">
            {/* Back link */}
            <Link to="/dashboard" className="tc-back">
              <FiArrowLeft className="tc-back-icon" />
              Back
            </Link>

            {/* Header */}
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

            {/* Action buttons */}
            <div className="tc-actions">
              <button onClick={handleCopyShare} className="tc-btn tc-btn-copy">
                <FiCopy />
                Copy Share Link
              </button>
              <button
                onClick={handleDownloadPDF}
                disabled={downloading}
                className="tc-btn tc-btn-download"
              >
                <FiDownload />
                {downloading ? "Generating..." : "Download PDF"}
              </button>
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

          .tc-back {
            display:inline-flex;
            align-items:center;
            gap:8px;
            color:rgba(148,163,184,0.6);
            text-decoration:none;
            font-size:13px;
            transition:color 0.15s;
            width:fit-content;
          }
          .tc-back:hover {
            color:#818CF8;
          }
          .tc-back-icon {
            font-size:15px;
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

          .tc-actions {
            display:flex;
            flex-wrap:wrap;
            gap:12px;
            margin-top:8px;
          }

          .tc-btn {
            display:inline-flex;
            align-items:center;
            gap:8px;
            padding:10px 22px;
            border-radius:10px;
            border:none;
            font-family:'Inter',sans-serif;
            font-size:13px;
            font-weight:500;
            cursor:pointer;
            transition:all 0.15s;
            text-decoration:none;
            justify-content:center;
          }
          .tc-btn:disabled {
            opacity:0.5;
            cursor:not-allowed;
          }
          .tc-btn-copy {
            background:linear-gradient(135deg,#6366F1,#4F46E5 55%,#0EA5E9);
            color:white;
            box-shadow:0 4px 16px rgba(99,102,241,0.25);
          }
          .tc-btn-copy:hover:not(:disabled) {
            transform:translateY(-2px);
            opacity:0.9;
          }
          .tc-btn-download {
            background:linear-gradient(135deg,#10B981,#059669 55%,#0EA5E9);
            color:white;
            box-shadow:0 4px 16px rgba(16,185,129,0.25);
          }
          .tc-btn-download:hover:not(:disabled) {
            transform:translateY(-2px);
            opacity:0.9;
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
            .tc-actions {
              flex-direction:column;
            }
            .tc-btn {
              width:100%;
              justify-content:center;
            }
          }
        `}</style>
      </div>
    </>
  );
};

export default ItineraryDetail;