import React from "react";
import { Navigate, useLocation } from "react-router-dom";

/**
 * Wrap any element that needs authentication.
 * If user isn’t logged in, redirect to /login,
 * preserving the intended location so you can come back.
 */
export function RequireAuth({ children }) {
  const token = localStorage.getItem("token");
  const location = useLocation();

  if (!token) {
    // send them to /login but save the current location
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
