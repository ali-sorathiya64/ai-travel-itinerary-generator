import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FiLogOut } from "react-icons/fi";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <nav className="tc-navbar">
      <div className="tc-navbar-inner">
        <Link to="/dashboard" className="tc-brand">
          {/* TripCraft logo SVG – same as login/register */}
          <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
            <circle cx="16" cy="16" r="14" stroke="url(#g1nav)" strokeWidth="1.5" />
            <path d="M4 16 Q16 8 28 16 Q16 24 4 16Z" fill="url(#g2nav)" opacity="0.55" />
            <circle cx="16" cy="16" r="3" fill="white" />
            <defs>
              <linearGradient id="g1nav" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
                <stop stopColor="#818CF8" /><stop offset="1" stopColor="#22D3EE" />
              </linearGradient>
              <linearGradient id="g2nav" x1="4" y1="16" x2="28" y2="16" gradientUnits="userSpaceOnUse">
                <stop stopColor="#818CF8" /><stop offset="1" stopColor="#22D3EE" />
              </linearGradient>
            </defs>
          </svg>
          <span className="tc-brand-text">TripCraft</span>
        </Link>

        {user && (
          <div className="tc-user">
            <span className="tc-greeting">Hi, {user.username || user.userName}</span>
            <button onClick={handleLogout} className="tc-logout">
              <FiLogOut />
              Logout
            </button>
          </div>
        )}
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');

        .tc-navbar {
          background: #0D111E;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          padding: 12px 24px;
          position: sticky;
          top: 0;
          z-index: 50;
          font-family: 'Inter', sans-serif;
        }

        .tc-navbar-inner {
          max-width: 880px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .tc-brand {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
        }

        .tc-brand-text {
          font-size: 18px;
          font-weight: 600;
          background: linear-gradient(90deg, #818CF8, #22D3EE);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          letter-spacing: -0.02em;
        }

        .tc-user {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .tc-greeting {
          color: rgba(203, 213, 225, 0.65);
          font-size: 14px;
          font-weight: 400;
        }

        .tc-logout {
          display: flex;
          align-items: center;
          gap: 6px;
          background: transparent;
          border: none;
          color: rgba(148, 163, 184, 0.5);
          font-size: 13px;
          font-weight: 500;
          font-family: 'Inter', sans-serif;
          cursor: pointer;
          padding: 6px 10px;
          border-radius: 8px;
          transition: all 0.15s;
        }
        .tc-logout:hover {
          color: #F87171;
          background: rgba(239, 68, 68, 0.08);
        }

        @media (max-width: 640px) {
          .tc-navbar {
            padding: 10px 16px;
          }
          .tc-brand-text {
            font-size: 16px;
          }
          .tc-greeting {
            font-size: 12px;
          }
          .tc-logout {
            font-size: 12px;
            padding: 4px 8px;
          }
          .tc-user {
            gap: 10px;
          }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;