import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export default function ProtectedRoute({ children }: Props) {
  const isLoggedIn = localStorage.getItem("adminLoggedIn") === "true";

  return isLoggedIn ? <>{children}</> : <Navigate to="/" replace />;
}
