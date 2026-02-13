import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/auth.store";
import type { JSX } from "react";

// export default function ProtectedRoute({ children }: any) {
//   const token = useAuthStore((s) => s.token);
//   return token ? children : <Navigate to="/login" />;
// }


interface Props {
  children: JSX.Element;
  requiredRoles: any;
}

const ProtectedRoute = ({ children, requiredRoles }: Props) => {
  const { token, role } = useAuthStore();

  // Not logged in
  if (!token) {
    return <Navigate to="/login" replace />;
  }


  // Role restriction exists
  if (requiredRoles && !requiredRoles.includes(role ?? "")) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};
export default ProtectedRoute;