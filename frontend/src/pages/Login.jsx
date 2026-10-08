import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      setErrorMessage("Please enter email and password.");
      return;
    }

    try {
      setLoading(true);
      setErrorMessage("");

      const response = await api.post("/login/", {
        email: email.trim(),
        password: password,
      });

      console.log("Login successful:", response.data);

      // Save JWT tokens
      localStorage.setItem("access_token", response.data.access);
      localStorage.setItem("refresh_token", response.data.refresh);

      // Go to dashboard
      window.location.href = "/dashboard";

    } catch (error) {
      console.log("Login failed:", error.response?.data);

      setErrorMessage(
        error.response?.data?.error ||
          error.response?.data?.detail ||
          "Invalid email or password."
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">

      {/* ================= LEFT SECTION ================= */}
      <div className="login-left">

        <div className="brand-section">

          <div className="brand-icon">
            🏥
          </div>

          <h1>HealthDoc-AI</h1>

          <p>
            Your intelligent healthcare document assistant
          </p>

        </div>

        {/* FEATURES */}
        <div className="feature-list">

          {/* Feature 1 */}
          <div className="feature-item">

            <span aria-hidden="true">
              📄
            </span>

            <div>
              <h3>
                Upload Documents
              </h3>

              <p>
                Securely upload your medical reports.
              </p>
            </div>

          </div>

          {/* Feature 2 */}
          <div className="feature-item">

            <span aria-hidden="true">
              🤖
            </span>

            <div>
              <h3>
                AI-Powered Answers
              </h3>

              <p>
                Ask questions about your medical documents.
              </p>
            </div>

          </div>

          {/* Feature 3 */}
          <div className="feature-item">

            <span aria-hidden="true">
              🔒
            </span>

            <div>
              <h3>
                Private & Secure
              </h3>

              <p>
                Your documents are protected by authentication.
              </p>
            </div>

          </div>

        </div>
      </div>


      {/* ================= RIGHT SECTION ================= */}
      <div className="login-right">

        <div className="login-card">

          {/* HEADER */}
          <div className="login-header">

            <div
              className="mobile-logo"
              aria-hidden="true"
            >
              🏥
            </div>

            <h2>
              Welcome Back
            </h2>

            <p>
              Sign in to continue to HealthDoc-AI
            </p>

          </div>


          {/* ================= LOGIN FORM ================= */}
          <form onSubmit={handleLogin}>

            {/* ERROR MESSAGE */}
            {errorMessage && (
              <div
                id="login-error"
                className="login-error"
                role="alert"
                aria-live="assertive"
              >

                <span aria-hidden="true">
                  ⚠️
                </span>

                <span>
                  {errorMessage}
                </span>

              </div>
            )}


            {/* EMAIL */}
            <div className="login-form-group">

              <label htmlFor="login-email">
                Email Address
              </label>

              <div className="login-input-wrapper">

                <span aria-hidden="true">
                  ✉️
                </span>

                <input
                  id="login-email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setErrorMessage("");
                  }}
                  placeholder="Enter your email"
                  autoComplete="email"
                  inputMode="email"
                  autoCapitalize="none"
                  spellCheck={false}
                  required
                  aria-required="true"
                  aria-invalid={!!errorMessage}
                  aria-describedby={
                    errorMessage
                      ? "login-error"
                      : undefined
                  }
                />

              </div>

            </div>


            {/* PASSWORD */}
            <div className="login-form-group">

              <label htmlFor="login-password">
                Password
              </label>

              <div className="login-input-wrapper">

                <span aria-hidden="true">
                  🔒
                </span>

                <input
                  id="login-password"
                  name="password"
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrorMessage("");
                  }}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                  aria-required="true"
                  aria-invalid={!!errorMessage}
                  aria-describedby={
                    errorMessage
                      ? "login-error"
                      : undefined
                  }
                />

              </div>

            </div>


            {/* LOGIN BUTTON */}
            <button
              type="submit"
              className="login-button"
              disabled={loading}
              aria-busy={loading}
            >

              {loading ? (
                <>
                  <span
                    className="login-spinner"
                    aria-hidden="true"
                  ></span>

                  Signing in...
                </>
              ) : (
                "Sign In"
              )}

            </button>

          </form>


          {/* ================= REGISTER ================= */}
          <div className="login-footer">

            <p>
              Don't have an account?{" "}
              <Link to="/register">
                Register here
              </Link>
            </p>

          </div>


          {/* SECURITY TEXT */}
          <div className="login-secure-text">
            🔒 Secure healthcare document assistance
          </div>

        </div>

      </div>

    </div>
  );
}

export default Login;
