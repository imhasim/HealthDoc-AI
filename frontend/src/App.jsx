import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import Dashboard from "./pages/Dashboard";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import Chat from "./pages/Chat";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<h1>HealthDoc-AI</h1>} />

        <Route
          path="/login"
          element={<Login/>}
            />

        <Route
          path="/register"
          element={<Register/>}
        />
        <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
                      }
                        />
        <Route
  path="/chat"
  element={
    <ProtectedRoute>
      <Chat />
    </ProtectedRoute>
  }
/>

      </Routes>
    </BrowserRouter>
  );
}

export default App;