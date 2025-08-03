import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

const ProtectedRoute = ({ role, children }) => {
  const { user, loading } = useAppContext();
  const location = useLocation();

  if (loading) return null;

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (role && user?.role !== role) {
    return <Navigate to="/" replace />;
  }

  if (user?.role === "freelancer") {
    const profileComplete = user.profileCompleted;

    if (
      !profileComplete &&
      location.pathname !== "/freelancer/complete-profile"
    ) {
      return <Navigate to="/freelancer/complete-profile" replace />;
    }

    if (
      profileComplete &&
      location.pathname === "/freelancer/complete-profile"
    ) {
      return <Navigate to="/freelancer/dashboard" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
