import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import DocumentUpload from "../components/DocumentUpload";
import "./Dashboard.css";

function Dashboard() {
  const [user, setUser] = useState(null);
  const [documents, setDocuments] = useState([]);

  const [loadingDocuments, setLoadingDocuments] = useState(true);
  const [profileError, setProfileError] = useState("");
  const [documentsError, setDocumentsError] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  const navigate = useNavigate();


  // ===============================
  // Logout
  // ===============================

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");

    navigate("/login");
  };


  // ===============================
  // Fetch Documents
  // ===============================

  const fetchDocuments = async () => {

    try {

      setLoadingDocuments(true);
      setDocumentsError("");

      const response = await api.get("/documents/");

      console.log("Documents:", response.data);

      setDocuments(response.data);

    } catch (error) {

      console.log(
        "Documents error:",
        error.response?.data
      );


      if (error.response) {

        const status = error.response.status;
        const data = error.response.data;


        if (status === 400) {

          setDocumentsError(
            data?.error ||
            data?.detail ||
            "Unable to load documents."
          );

        } else if (status === 404) {

          setDocumentsError(
            "Documents could not be found."
          );

        } else if (status === 500) {

          setDocumentsError(
            "Server error. Please try again later."
          );

        } else {

          setDocumentsError(
            data?.error ||
            data?.detail ||
            "Unable to load documents."
          );
        }

      } else {

        setDocumentsError(
          "Unable to connect to server. Please make sure the backend is running."
        );
      }

    } finally {

      setLoadingDocuments(false);

    }
  };


  // ===============================
  // Delete Document
  // ===============================

  const handleDelete = async (documentId) => {

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this document?"
    );


    if (!confirmDelete) {
      return;
    }


    try {

      setDeleteError("");
      setDeletingId(documentId);


      await api.delete(
        `/documents/${documentId}/`
      );


      console.log(
        "Document deleted successfully:",
        documentId
      );


      await fetchDocuments();

    } catch (error) {

      console.log(
        "Delete error:",
        error.response?.data
      );


      if (error.response) {

        const status = error.response.status;
        const data = error.response.data;


        if (status === 400) {

          setDeleteError(
            data?.error ||
            data?.detail ||
            "Unable to delete this document."
          );

        } else if (status === 404) {

          setDeleteError(
            data?.error ||
            "Document not found. It may have already been deleted."
          );

        } else if (status === 500) {

          setDeleteError(
            "Server error. Unable to delete the document."
          );

        } else {

          setDeleteError(
            data?.error ||
            data?.detail ||
            "Unable to delete the document."
          );
        }

      } else {

        setDeleteError(
          "Unable to connect to server. Please try again."
        );
      }

    } finally {

      setDeletingId(null);

    }
  };


  // ===============================
  // Get Profile
  // ===============================

  useEffect(() => {

    const getProfile = async () => {

      try {

        setProfileError("");

        const response = await api.get(
          "/profile/"
        );

        console.log(
          "Profile:",
          response.data
        );

        setUser(response.data);

      } catch (error) {

        console.log(
          "Profile error:",
          error.response?.data
        );


        if (error.response) {

          const status = error.response.status;
          const data = error.response.data;


          if (status === 500) {

            setProfileError(
              "Unable to load your profile."
            );

          } else {

            setProfileError(
              data?.error ||
              data?.detail ||
              "Unable to load your profile."
            );
          }

        } else {

          setProfileError(
            "Unable to connect to server."
          );
        }
      }
    };


    getProfile();
    fetchDocuments();

  }, []);


  return (
    <div className="dashboard">

      {/* ================= HEADER ================= */}

      <header className="dashboard-header">

        <div className="brand">

          <div className="brand-icon">
            🩺
          </div>

          <div>

            <h1>
              HealthDoc-AI
            </h1>

            <span>
              Healthcare Document Intelligence
            </span>

          </div>

        </div>


        <button
          className="logout-btn"
          onClick={handleLogout}
        >
          Logout
        </button>

      </header>


      {/* ================= MAIN ================= */}

      <main className="dashboard-container">


        {/* ================= WELCOME ================= */}

        <section className="welcome-section">

          <div>

            <p className="welcome-label">
              DASHBOARD
            </p>

            <h2>
              Welcome back,{" "}
              <span>
                {user?.username || "User"}
              </span>{" "}
              👋
            </h2>

            <p className="welcome-text">
              Manage your medical documents and ask
              questions using AI.
            </p>

          </div>

        </section>


        {/* ================= PROFILE ERROR ================= */}

        {profileError && (

          <div className="error-box">

            ⚠️ {profileError}

          </div>

        )}


        {/* ================= STATS ================= */}

        <section className="stats-grid">

          <div className="stat-card">

            <div className="stat-icon">
              📄
            </div>

            <div>

              <p>
                Total Documents
              </p>

              <h3>
                {loadingDocuments
                  ? "..."
                  : documents.length}
              </h3>

            </div>

          </div>


          <div className="stat-card">

            <div className="stat-icon green">
              🔒
            </div>

            <div>

              <p>
                Secure Storage
              </p>

              <h3>
                Protected
              </h3>

            </div>

          </div>


          <div className="stat-card">

            <div className="stat-icon purple">
              🤖
            </div>

            <div>

              <p>
                AI Assistant
              </p>

              <h3>
                Ready
              </h3>

            </div>

          </div>

        </section>


        {/* ================= PROFILE ================= */}

        <section className="profile-card">

          <div className="profile-avatar">

            {user?.username
              ? user.username
                  .charAt(0)
                  .toUpperCase()
              : "U"}

          </div>


          <div className="profile-info">

            <h3>
              {user?.username || "User"}
            </h3>

            <p>
              {user?.email || "Loading email..."}
            </p>

          </div>


          <div className="profile-status">

            <span></span>

            Active Account

          </div>

        </section>


        {/* ================= UPLOAD ================= */}

        <section className="upload-section">

          <div className="section-heading">

            <div>

              <h2>
                Upload Medical Document
              </h2>

              <p>
                Upload your PDF medical reports and
                analyze them with AI.
              </p>

            </div>


            <div className="pdf-badge">
              PDF
            </div>

          </div>


          <DocumentUpload
            onUploadSuccess={fetchDocuments}
          />

        </section>


        {/* ================= DOCUMENTS ================= */}

        <section className="documents-section">

          <div className="section-heading">

            <div>

              <h2>
                My Documents
              </h2>

              <p>
                Your uploaded medical documents
              </p>

            </div>


            <div className="document-count">

              {loadingDocuments
                ? "Loading..."
                : `${documents.length} Files`}

            </div>

          </div>


          {/* Documents Error */}

          {documentsError && (

            <div className="error-box">

              <span>
                ⚠️
              </span>

              <span>
                {documentsError}
              </span>

            </div>

          )}


          {/* Delete Error */}

          {deleteError && (

            <div className="error-box">

              <span>
                ⚠️
              </span>

              <span>
                {deleteError}
              </span>

            </div>

          )}


          {/* Loading */}

          {loadingDocuments ? (

            <div className="empty-state">

              <div className="empty-icon">
                ⏳
              </div>

              <h3>
                Loading documents...
              </h3>

              <p>
                Please wait while we fetch your
                medical documents.
              </p>

            </div>

          ) : documents.length === 0 ? (

            <div className="empty-state">

              <div className="empty-icon">
                📂
              </div>

              <h3>
                No documents yet
              </h3>

              <p>
                Upload your first medical PDF to
                get started with HealthDoc-AI.
              </p>

            </div>

          ) : (

            <div className="documents-list">

              {documents.map((document) => (

                <div
                  className="document-card"
                  key={document.id}
                >

                  <div className="document-left">

                    <div className="document-icon">
                      📄
                    </div>


                    <div className="document-info">

                      <h3>
                        {document.file
                          ?.split("/")
                          .pop()}
                      </h3>

                      <p>
                        Medical PDF Document
                      </p>

                    </div>

                  </div>


                  <div className="document-actions">

                    <button
                      className="chat-btn"
                      onClick={() =>
                        navigate("/chat")
                      }

                      disabled={
                        deletingId === document.id
                      }
                    >
                      🤖 Ask AI
                    </button>


                    <button
                      className="delete-btn"
                      onClick={() =>
                        handleDelete(document.id)
                      }

                      disabled={
                        deletingId === document.id
                      }
                    >

                      {deletingId === document.id
                        ? "Deleting..."
                        : "🗑 Delete"}

                    </button>

                  </div>

                </div>

              ))}

            </div>

          )}

        </section>

      </main>

    </div>
  );
}

export default Dashboard;

