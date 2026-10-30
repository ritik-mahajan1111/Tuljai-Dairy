import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const {
    isAuthenticated,
    loading,
  } = useAuth();

  // Session check ho raha hai
  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{
          minHeight: "100vh",
          background: "#f5f8fc",
        }}
      >
        <div className="text-center">
          <div
            className="spinner-border text-primary"
            role="status"
          />

          <p className="mt-3 text-muted">
            Loading Tuljai Dairy...
          </p>
        </div>
      </div>
    );
  }

  // Login nahi hai
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Login hai
  return children;
};

export default ProtectedRoute;