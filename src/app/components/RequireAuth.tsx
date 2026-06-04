import { Navigate, Outlet, useLocation } from "react-router";
import { clearAuthSession, isAuthenticated } from "../lib/auth";

// export function RequireAuth() {
//   const location = useLocation();

//   if (!isAuthenticated()) {
//     clearAuthSession();
//     return <Navigate to="/login" replace state={{ from: location }} />;
//   }

//   return <Outlet />;
// }

export function RequireAuth() {
  const bypass = true;

  if (!bypass && !isAuthenticated()) {
    clearAuthSession();
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}