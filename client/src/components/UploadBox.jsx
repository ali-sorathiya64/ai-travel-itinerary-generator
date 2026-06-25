import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { FiUploadCloud, FiFile } from "react-icons/fi";
import api from "../api/axios";
import toast from "react-hot-toast";

const UploadBox = ({ onUploadSuccess }) => {
  const [uploading, setUploading] = useState(false);
  const [fileName, setFileName] = useState("");

  const onDrop = useCallback(
    async (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (!file) return;

      setFileName(file.name);
      setUploading(true);

      const formData = new FormData();
      formData.append("file", file);

      try {
        const { data } = await api.post("/itinerary/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Itinerary generated!");
        onUploadSuccess(data.data);
      } catch (error) {
        toast.error(error.response?.data?.message || "Upload failed");
      } finally {
        setUploading(false);
        setFileName("");
      }
    },
    [onUploadSuccess]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "image/png": [".png"],
      "image/jpeg": [".jpg", ".jpeg"],
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024,
    disabled: uploading,
  });

  return (
    <div
      {...getRootProps()}
      className={`tc-upload-box ${isDragActive ? "tc-upload-active" : ""} ${
        uploading ? "tc-upload-uploading" : ""
      }`}
    >
      <input {...getInputProps()} />

      {uploading ? (
        <div className="tc-upload-progress">
          <div className="tc-spinner" />
          <p className="tc-progress-text">
            Processing <span className="tc-filename">{fileName}</span>...
          </p>
          <p className="tc-progress-hint">Extracting data & generating itinerary with AI</p>
        </div>
      ) : (
        <div className="tc-upload-content">
          <FiUploadCloud className="tc-upload-icon" />
          <p className="tc-upload-main-text">
            {isDragActive ? "Drop file here" : "Drag & drop or click to upload"}
          </p>
          <p className="tc-upload-hint">
            <FiFile className="tc-hint-icon" /> PDF, PNG, JPG — flight tickets, hotel bookings, etc.
          </p>
        </div>
      )}

      <style>{`
        .tc-upload-box {
          background: rgba(255,255,255,0.025);
          border: 1.5px dashed rgba(255,255,255,0.1);
          border-radius: 14px;
          padding: 36px 20px;
          text-align: center;
          color: rgba(255,255,255,0.7);
          transition: border-color 0.25s, background 0.25s;
          cursor: pointer;
          position: relative;
        }
        .tc-upload-box:hover {
          border-color: rgba(129,140,248,0.35);
          background: rgba(255,255,255,0.04);
        }
        .tc-upload-active {
          border-color: #818CF8;
          background: rgba(129,140,248,0.08);
        }
        .tc-upload-uploading {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .tc-upload-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
        }

        .tc-upload-icon {
          font-size: 40px;
          color: #818CF8;
        }

        .tc-upload-main-text {
          font-size: 15px;
          font-weight: 500;
          color: rgba(255,255,255,0.8);
          margin: 0;
        }

        .tc-upload-hint {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 12px;
          color: rgba(148,163,184,0.5);
          margin: 0;
        }
        .tc-hint-icon {
          font-size: 13px;
        }

        .tc-upload-progress {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
        }

        .tc-spinner {
          width: 28px;
          height: 28px;
          border: 3px solid rgba(255,255,255,0.1);
          border-top-color: #818CF8;
          border-radius: 50%;
          animation: tc-spin 0.8s linear infinite;
        }

        @keyframes tc-spin {
          to { transform: rotate(360deg); }
        }

        .tc-progress-text {
          font-size: 14px;
          color: rgba(255,255,255,0.7);
          margin: 0;
        }
        .tc-filename {
          color: #818CF8;
          font-weight: 500;
        }
        .tc-progress-hint {
          font-size: 12px;
          color: rgba(148,163,184,0.4);
          margin: 0;
        }

        @media (max-width: 640px) {
          .tc-upload-box {
            padding: 24px 16px;
          }
          .tc-upload-icon {
            font-size: 32px;
          }
          .tc-upload-main-text {
            font-size: 14px;
          }
        }
      `}</style>
    </div>
  );
};

export default UploadBox;