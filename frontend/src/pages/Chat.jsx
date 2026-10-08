import { useState, useEffect } from "react";
import api from "../services/api";
import "./Chat.css";

function Chat() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [sources, setSources] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [selectedDocument, setSelectedDocument] = useState("");
  const [documentsLoading, setDocumentsLoading] = useState(false);

  // ===============================
  // Fetch Documents
  // ===============================

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        setDocumentsLoading(true);
        setErrorMessage("");

        const response = await api.get("/documents/");

        console.log("Documents:", response.data);

        setDocuments(response.data);

      } catch (error) {
        console.log("Documents fetch failed:", error);

        if (error.response) {
          const status = error.response.status;
          const data = error.response.data;

          if (status === 400) {
            setErrorMessage(
              data?.error ||
              data?.detail ||
              "Unable to load documents."
            );
          } else if (status === 404) {
            setErrorMessage(
              "Documents could not be found."
            );
          } else if (status === 500) {
            setErrorMessage(
              "Server error. Please try again later."
            );
          } else {
            setErrorMessage(
              data?.error ||
              data?.detail ||
              "Unable to load documents."
            );
          }

        } else {
          setErrorMessage(
            "Unable to connect to server. Please make sure the backend is running."
          );
        }

      } finally {
        setDocumentsLoading(false);
      }
    };

    fetchDocuments();
  }, []);


  // ===============================
  // Chat
  // ===============================

  const handleChat = async () => {

    // Question validation
    if (!question.trim()) {
      setErrorMessage("Please enter a question.");
      return;
    }

    // Document validation
    if (!selectedDocument) {
      setErrorMessage("Please select a document.");
      return;
    }


    setAnswer("");
    setSources([]);
    setErrorMessage("");
    setLoading(true);


    try {

      const response = await api.post(
        "/documents/chat/",
        {
          question: question,
          document_id: selectedDocument,
        }
      );


      console.log("Chat response:", response.data);


      // Check answer
      if (response.data?.answer) {
        setAnswer(response.data.answer);
      } else {
        setAnswer(
          "No answer was returned from the AI."
        );
      }


      // Check sources
      setSources(response.data?.sources || []);


    } catch (error) {

      console.log("FULL ERROR:", error);


      // ===============================
      // Backend Error
      // ===============================

      if (error.response) {

        const status = error.response.status;
        const data = error.response.data;


        // 400
        if (status === 400) {

          setErrorMessage(
            data?.error ||
            data?.detail ||
            "Invalid question or document."
          );
        }


        // 404
        else if (status === 404) {

          setErrorMessage(
            data?.error ||
            "Selected document was not found."
          );
        }


        // 500
        else if (status === 500) {

          setErrorMessage(
            "Server error. Please try again later."
          );
        }


        // Other backend errors
        else {

          setErrorMessage(
            data?.error ||
            data?.detail ||
            "Something went wrong. Please try again."
          );
        }

      }


      // ===============================
      // Network Error
      // ===============================

      else {

        setErrorMessage(
          "Unable to connect to server. Please make sure the backend is running."
        );
      }

    } finally {

      setLoading(false);

    }
  };


  return (
    <div className="chat-page">

      {/* Header */}

      <div className="chat-header">

        <div>

          <div className="chat-title-row">

            <div className="chat-icon">
              🤖
            </div>

            <div>

              <h1>
                HealthDoc-AI Chat
              </h1>

              <p>
                Ask questions about your medical documents
              </p>

            </div>

          </div>

        </div>


        <div className="status-badge">

          <span className="status-dot"></span>

          AI Assistant Online

        </div>

      </div>


      {/* Chat Box */}

      <div className="chat-card">


        {/* Document Selection */}

        <div className="form-group">

          <label>
            Select Document
          </label>


          <div className="select-wrapper">

            <span className="input-icon">
              📄
            </span>


            <select
              value={selectedDocument}
              onChange={(e) => {

                console.log(
                  "Selected document:",
                  e.target.value
                );

                setSelectedDocument(
                  e.target.value
                );

                setAnswer("");
                setSources([]);
                setErrorMessage("");

              }}

              disabled={documentsLoading || loading}
            >

              <option value="">
                {documentsLoading
                  ? "Loading documents..."
                  : "Choose a document..."
                }
              </option>


              {documents.map((document) => (

                <option
                  key={document.id}
                  value={document.id}
                >
                  {document.file}
                </option>

              ))}

            </select>

          </div>

        </div>


        {/* Question */}

        <div className="form-group">

          <label>
            Your Question
          </label>


          <textarea
            placeholder="Ask something about your selected document..."
            value={question}

            onChange={(e) => {

              setQuestion(e.target.value);
              setErrorMessage("");

            }}

            rows="5"

            disabled={loading}
          />


          <div className="question-hint">

            💡 Ask questions like:
            "What is the patient's hemoglobin?"

          </div>

        </div>


        {/* Error */}

        {errorMessage && (

          <div className="error-box">

            <span>
              ⚠️
            </span>

            <span>
              {errorMessage}
            </span>

          </div>

        )}


        {/* Ask Button */}

        <button
          className="ask-button"
          onClick={handleChat}

          disabled={
            loading ||
            !question.trim() ||
            !selectedDocument
          }
        >

          {loading ? (

            <>

              <span className="spinner"></span>

              Analyzing Document...

            </>

          ) : (

            <>
              ✨ Ask HealthDoc-AI
            </>

          )}

        </button>

      </div>


      {/* Answer */}

      {answer && (

        <div className="result-card answer-card">

          <div className="result-header">

            <div className="result-icon answer-icon">
              🤖
            </div>


            <div>

              <h2>
                AI Answer
              </h2>

              <p>
                Based on your selected medical document
              </p>

            </div>

          </div>


          <div className="answer-content">

            <p>
              {answer}
            </p>

          </div>

        </div>

      )}


      {/* Sources */}

      {sources.length > 0 && (

        <div className="result-card sources-card">

          <div className="result-header">

            <div className="result-icon source-icon">
              📚
            </div>


            <div>

              <h2>
                Document Sources
              </h2>

              <p>
                Relevant information retrieved from your document
              </p>

            </div>


            <div className="source-count">

              {sources.length} Sources

            </div>

          </div>


          <div className="sources-list">

            {sources.map((source, index) => (

              <div
                className="source-item"
                key={index}
              >

                <div className="source-number">

                  {index + 1}

                </div>


                <div className="source-content">

                  <h3>
                    Source {index + 1}
                  </h3>

                  <p>
                    {source.content}
                  </p>

                </div>

              </div>

            ))}

          </div>

        </div>

      )}

    </div>
  );
}

export default Chat;

