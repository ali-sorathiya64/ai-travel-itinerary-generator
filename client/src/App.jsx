import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import {AuthProvider}  from "./context/AuthContext"
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import Register from "./pages/Register";
import VerifyEmail from "./pages/VerifyEmail";
import Dashboard from "./pages/Dashboard";
import ItineraryDetail from "./pages/ItineraryDetail";
import SharedItinerary from "./pages/SharedItinerary";

function App() {
  return (
    <AuthProvider>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/share/:shareId" element={<SharedItinerary />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/itinerary/:id"
          element={
            <ProtectedRoute>
              <ItineraryDetail />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Login />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;