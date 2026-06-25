import { Link } from "react-router-dom";
import { format } from "date-fns";
import {
  FiMapPin,
  FiCalendar,
  FiTrash2,
  FiArrowRight,
  FiAirplay
} from "react-icons/fi";

const ItineraryCard = ({ item, onDelete }) => {
  const data = item.itinerary || {};
  const title = data.title || item.title || "AI Trip";
  const flight = data.flight;
  const summary = data.summary;
  const confidence = data.confidence;

  return (
    <div className="tc-itinerary-card">
      <div className="tc-card-inner">
        <Link to={`/itinerary/${item._id}`} className="tc-card-link">
          <div className="tc-card-header">
            <div className="tc-icon-wrap">
              <FiAirplay />
            </div>
            <h3 className="tc-card-title">{title}</h3>
          </div>

          {flight?.departure && (
            <div className="tc-flight-info">
              <FiMapPin className="tc-flight-icon" />
              <span>
                {flight.departure}
                <FiArrowRight className="tc-arrow" />
                {flight.arrival || "Unknown"}
              </span>
            </div>
          )}

          {summary && <p className="tc-summary-text">{summary}</p>}

          <div className="tc-card-footer">
            <p className="tc-date">
              <FiCalendar />
              {item.createdAt && format(new Date(item.createdAt), "dd MMM yyyy")}
            </p>
            {typeof confidence === "number" && (
              <span
                className={`tc-confidence-badge ${
                  confidence > 0.6 ? "tc-high" : "tc-low"
                }`}
              >
                {Math.round(confidence * 100)}% AI confidence
              </span>
            )}
          </div>
        </Link>

        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onDelete(item._id);
          }}
          className="tc-delete-btn"
          title="Delete itinerary"
        >
          <FiTrash2 size={18} />
        </button>
      </div>

      <style>{`
        .tc-itinerary-card {
          background: rgba(255,255,255,0.035);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 14px;
          padding: 18px 18px 16px;
          transition: transform 0.15s, border-color 0.2s, box-shadow 0.2s;
          height: 100%;
          display: flex;
          flex-direction: column;
        }
        .tc-itinerary-card:hover {
          transform: translateY(-3px);
          border-color: rgba(129,140,248,0.25);
          box-shadow: 0 6px 20px rgba(0,0,0,0.3);
        }

        .tc-card-inner {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 12px;
          flex: 1;
        }

        .tc-card-link {
          flex: 1;
          text-decoration: none;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .tc-card-header {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .tc-icon-wrap {
          background: rgba(129,140,248,0.12);
          color: #818CF8;
          padding: 8px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .tc-icon-wrap svg {
          width: 16px;
          height: 16px;
        }

        .tc-card-title {
          color: white;
          font-size: 16px;
          font-weight: 500;
          margin: 0;
          transition: color 0.15s;
        }
        .tc-card-link:hover .tc-card-title {
          color: #818CF8;
        }

        .tc-flight-info {
          display: flex;
          align-items: center;
          gap: 6px;
          color: rgba(148,163,184,0.6);
          font-size: 13px;
        }
        .tc-flight-icon {
          color: #818CF8;
          flex-shrink: 0;
        }
        .tc-arrow {
          display: inline;
          margin: 0 4px;
          font-size: 12px;
        }

        .tc-summary-text {
          color: rgba(148,163,184,0.6);
          font-size: 13px;
          line-height: 1.5;
          margin: 0;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .tc-card-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 12px;
        }

        .tc-date {
          display: flex;
          align-items: center;
          gap: 4px;
          color: rgba(148,163,184,0.4);
          font-size: 11px;
          margin: 0;
        }

        .tc-confidence-badge {
          font-size: 11px;
          padding: 2px 12px;
          border-radius: 20px;
          font-weight: 500;
        }
        .tc-high {
          background: rgba(34,197,94,0.15);
          color: #34D399;
        }
        .tc-low {
          background: rgba(234,179,8,0.15);
          color: #FACC15;
        }

        .tc-delete-btn {
          background: transparent;
          border: none;
          color: #F87171;
          padding: 6px;
          border-radius: 8px;
          cursor: pointer;
          transition: background 0.15s, color 0.15s;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          margin-top: 2px;
        }
        .tc-delete-btn:hover {
          background: rgba(239,68,68,0.12);
          color: #FCA5A5;
        }

        @media (max-width: 640px) {
          .tc-itinerary-card {
            padding: 14px 14px 12px;
          }
          .tc-card-title {
            font-size: 15px;
          }
        }
      `}</style>
    </div>
  );
};

export default ItineraryCard;