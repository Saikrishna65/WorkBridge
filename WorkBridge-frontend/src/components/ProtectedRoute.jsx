import React from "react";
import { Navigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

const ProtectedRoute = ({ role, children }) => {
  const { user, isAuthenticated, loading } = useAppContext();

  if (loading) return null;

  // Not logged in at all
  if (!isAuthenticated) {
    return <Navigate to="/auth" />;
  }

  if (role && user?.role !== role) {
    return user.role === "freelancer" ? (
      <Navigate to="/freelancer/complete-profile" />
    ) : (
      <Navigate to="/" />
    );
  }

  return children;
};

export default ProtectedRoute;
