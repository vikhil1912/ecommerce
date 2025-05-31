import React from "react";
import { Navigate } from "react-router-dom";

const ProtectRoute = ({ children, isAdminRoute, isAuthRoute }) => {
  const user = localStorage.getItem("user");
  const role = localStorage.getItem("role");
  console.log(user, role);

  if (!user) {
    if (isAuthRoute) {
      return children;
    }
    return <Navigate to="/" />;
  }
  if (isAuthRoute) {
    return <Navigate to="/" />;
  }
  if (isAdminRoute && role !== "admin") {
    return <Navigate to="/" />;
  }
  return children;
};

export default ProtectRoute;
