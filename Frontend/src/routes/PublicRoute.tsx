import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/auth.store";
import type { JSX } from "react";

interface Props {
  children: JSX.Element;
}

const PublicRoute = ({ children }: Props) => {
  const { token, role } = useAuthStore();

  if (token && role === "Admin") {
    return <Navigate to="/admin/categories" replace />;
  }

  if (token && role === "User") {
    return <Navigate to="/orders" replace />;
  }

  return children;
};

export default PublicRoute;
