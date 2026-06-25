const Loader = ({ text = "Loading..." }) => {
  return (
    <div className="tc-loader">
      <div className="tc-loader-spinner" />
      <p className="tc-loader-text">{text}</p>

      <style>{`
        .tc-loader {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 40px 20px;
          font-family: 'Inter', sans-serif;
        }

        .tc-loader-spinner {
          width: 36px;
          height: 36px;
          border: 3px solid rgba(255,255,255,0.08);
          border-top-color: #818CF8;
          border-radius: 50%;
          animation: tc-loader-spin 0.8s linear infinite;
        }

        @keyframes tc-loader-spin {
          to { transform: rotate(360deg); }
        }

        .tc-loader-text {
          margin-top: 12px;
          font-size: 14px;
          color: rgba(148,163,184,0.5);
          font-weight: 400;
        }
      `}</style>
    </div>
  );
};

export default Loader;