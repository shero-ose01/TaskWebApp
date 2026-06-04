import { useState } from "react";
import { logout, me } from "../api/auth";
import type { MeResponse } from "../api/types";

export function Header() {
  const [user, setUser] = useState<MeResponse | null>(null);
  const [expanded, setExpanded] = useState(false);

  async function handleLogout() {
    await logout();
    window.location.href = "/login";
  }

  async function showAccountDetails() {
    if (user == null) setUser(await me());
    setExpanded(!expanded);
  }

  return (
    <div className="header">
      <button onClick={handleLogout}>Logout</button>
      <div className="account-menu">
        <button onClick={showAccountDetails}>Account</button>
        {expanded && (
          <div className="details">
            <p>{user?.username}</p>
            <p>{user?.email}</p>
            <p>{new Date(user?.createdAt).toLocaleDateString()}</p>
          </div>
        )}
      </div>
    </div>
  );
}
