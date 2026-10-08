import { useState } from "react";
import api from "../services/api";
import "./Register.css";

function Register() {

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!username.trim() || !email.trim() || !password.trim()) {
      setErrorMessage("Please fill in all fields.");
      return;
    }

    try {

      setLoading(true);
      setErrorMessage("");
      setSuccessMessage("");

      const response = await api.post("/register/", {
        username: username,
        email: email,
        password: password,
      });

      console.log("Registration successful:", response.data);

      setSuccessMessage(
        "Account created successfully! You can now login."
      );

      setUsername("");
      setEmail("");
      setPassword("");

    } catch (error) {

      console.log("Registration failed:", error.response?.data);

      const errorData = error.response?.data;

      if (errorData?.username) {
        setErrorMessage(errorData.username[0]);
      } else if (errorData?.email) {
        setErrorMessage(errorData.email[0]);
      } else if (errorData?.password) {
        setErrorMessage(errorData.password[0]);
      } else if (errorData?.error) {
        setErrorMessage(errorData.error);
      } else {
        setErrorMessage("Registration failed. Please try again.");
      }

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">

      {/* Left Side */}
      <div className="register-left">

        <div className="register-brand">

          <div className="register-brand-icon">
            🏥
          </div>

          <h1>HealthDoc-AI</h1>

          <p>
            Your intelligent healthcare document assistant
          </p>

        </div>


        <div className="register-features">

          <div className="register-feature">

            <span>📄</span>

            <div>
              <h3>Manage Medical Documents</h3>
              <p>
                Upload and organize your healthcare reports securely.
              </p>
            </div>

          </div>


          <div className="register-feature">

            <span>🤖</span>

            <div>
              <h3>Ask AI Questions</h3>
              <p>
                Get answers from your uploaded medical documents.
              </p>
            </div>

          </div>


          <div className="register-feature">

            <span>🔒</span>

            <div>
              <h3>Secure Account</h3>
              <p>
                Your account and documents are protected with authentication.
              </p>
            </div>

          </div>

        </div>

      </div>


      {/* Right Side */}
      <div className="register-right">

        <div className="register-card">

          <div className="register-header">

            <div className="register-mobile-logo">
              🏥
            </div>

            <h2>Create Your Account</h2>

            <p>
              Get started with HealthDoc-AI
            </p>

          </div>


          <form onSubmit={handleRegister}>

            {/* Error */}
            {errorMessage && (
              <div className="register-error">
                <span>⚠️</span>
                <span>{errorMessage}</span>
              </div>
            )}


            {/* Success */}
            {successMessage && (
              <div className="register-success">
                <span>✓</span>
                <span>{successMessage}</span>
              </div>
            )}


            {/* Username */}
            <div className="register-form-group">

              <label>Username</label>

              <div className="register-input-wrapper">

                <span>👤</span>

                <input
                  type="text"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    setErrorMessage("");
                  }}
                  placeholder="Enter your username"
                />

              </div>

            </div>


            {/* Email */}
            <div className="register-form-group">

              <label>Email Address</label>

              <div className="register-input-wrapper">

                <span>✉️</span>

                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setErrorMessage("");
                  }}
                  placeholder="Enter your email"
                />

              </div>

            </div>


            {/* Password */}
            <div className="register-form-group">

              <label>Password</label>

              <div className="register-input-wrapper">

                <span>🔒</span>

                <input
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrorMessage("");
                  }}
                  placeholder="Create a password"
                />

              </div>

            </div>


            {/* Button */}
            <button
              type="submit"
              className="register-button"
              disabled={loading}
            >

              {loading ? (
                <>
                  <span className="register-spinner"></span>
                  Creating Account...
                </>
              ) : (
                <>
                  Create Account
                </>
              )}

            </button>

          </form>


          <div className="register-footer">

            <p>
              Already have an account?
            </p>

            <a href="/login">
              Sign in to HealthDoc-AI
            </a>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Register;
