import { useState } from "react";
import { logout, me } from "../api/auth";
import type { MeResponse } from "../api/types";
import { UserCircle } from "lucide-react"
import { GetToken } from "../api/client";
import { Link, useLocation } from "react-router-dom";

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

  useLocation();

  return (
    <header className="header">
      <Link to="/">
        <span className="title">Task Tracker</span>
      </Link>

      {GetToken() && (
        <div className="account-menu">
          <button onClick={showAccountDetails} className="icon-button">
            <UserCircle size={28} />
          </button>
          {expanded && user && (
            <div className="details">
              <p>{user.username}</p>
              <p>{user.email}</p>
              <p>{new Date(user.createdAt).toLocaleDateString()}</p>
              <button onClick={handleLogout}>Logout</button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
