import { useState } from "react";
import api from "../services/api";
import "./DocumentUpload.css";

function DocumentUpload({ onUploadSuccess }) {

  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e) => {

    e.preventDefault();

    if (!file) {
      setErrorMessage("Please select a PDF file.");
      setMessage("");
      return;
    }

    setMessage("");
    setErrorMessage("");
    setUploading(true);

    const formData = new FormData();

    formData.append("file", file);

    try {

      const response = await api.post(
        "/documents/upload/",
        formData
      );

      console.log("Upload successful:", response.data);

      setMessage("PDF uploaded successfully!");
      setErrorMessage("");

      onUploadSuccess();

      setFile(null);

      // Reset file input
      e.target.reset();

    } catch (error) {

      console.log(
        "Upload failed:",
        error.response?.data
      );

      if (error.response) {

        const status = error.response.status;
        const data = error.response.data;

        if (status === 400) {

          setErrorMessage(
            data?.error ||
            data?.detail ||
            "Invalid file or request."
          );

        } else if (status === 401) {

          setErrorMessage(
            "Your session has expired. Please login again."
          );

        } else if (status === 404) {

          setErrorMessage(
            data?.error ||
            "Upload endpoint not found."
          );

        } else if (status === 500) {

          setErrorMessage(
            "Server error. Please try again later."
          );

        } else {

          setErrorMessage(
            data?.error ||
            data?.detail ||
            "Upload failed. Please try again."
          );
        }

      } else {

        setErrorMessage(
          "Unable to connect to server. Please make sure the backend is running."
        );
      }

    } finally {

      setUploading(false);

    }
  };

  return (
    <div className="upload-box">

      <div className="upload-icon">
        📄
      </div>

      <div className="upload-content">

        <h3>
          Upload Medical PDF
        </h3>

        <p>
          Select a medical report in PDF format
          to analyze it with HealthDoc-AI.
        </p>

        <form onSubmit={handleUpload}>

          <div className="file-input-wrapper">

            <input
              id="medical-file"
              type="file"
              accept=".pdf,application/pdf"
              onChange={(e) => {

                const selectedFile =
                  e.target.files[0];

                setFile(selectedFile);
                setMessage("");
                setErrorMessage("");

              }}
              disabled={uploading}
            />

            <label htmlFor="medical-file">
              {file
                ? `📄 ${file.name}`
                : "Choose PDF file"}
            </label>

          </div>


          {file && (

            <div className="selected-file">

              <span>
                Selected:
              </span>

              <strong>
                {file.name}
              </strong>

            </div>

          )}


          <button
            type="submit"
            className="upload-button"
            disabled={uploading || !file}
          >

            {uploading ? (
              <>
                <span className="upload-spinner"></span>
                Uploading...
              </>
            ) : (
              <>
                ⬆️ Upload PDF
              </>
            )}

          </button>

        </form>


        {message && (

          <div className="upload-success">
            ✅ {message}
          </div>

        )}


        {errorMessage && (

          <div className="upload-error">
            ⚠️ {errorMessage}
          </div>

        )}

      </div>

    </div>
  );
}

export default DocumentUpload;

