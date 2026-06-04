// So this one im not sure i need but ive read that this prevents from people directly jump to task page before login
// Normally when someone jumps to task before login they would request the task list from the server, get an auth error and be send back to login screen but this basically stops that aswell

import { Navigate, Outlet } from "react-router-dom";
import { GetToken } from "../api/client";

export function RequireAuth() {
  const token = GetToken();
  if (token) return <Outlet />;
  else return <Navigate to="/login" replace />;
}
