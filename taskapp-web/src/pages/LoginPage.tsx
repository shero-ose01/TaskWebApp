import { useState, type SubmitEvent } from "react";
import { login } from "../api/auth";
import { Link, useNavigate } from "react-router-dom";
import { ApiError } from "../api/types";
import { PasswordInput } from "../components/PasswordInput";

export function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submit, setSubmit] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    setError(null);
    setSubmit(true);
    try {
      await login({ email, password });
      navigate("/tasks");
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        setError(error.body?.message ?? "Invalid Credentials");
      } else {
        setError("Server Error");
      }
    }
    setSubmit(false);
  }

  return (
    <div className="login-form">
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          required
          autoComplete="email"
          placeholder="Email"
        />
        <label htmlFor="password">Password</label>
        <PasswordInput
          id="password"
          value={password}
          onChange={(p) => setPassword(p.target.value)}
          required
          minLength={8}
          placeholder="Password"
        />
        <button id="login-button" type="submit" disabled={submit}>
          Login
        </button>
      </form>
      {error && <p>{error}</p>}
      <Link to="/register">Register</Link>
    </div>
  );
}
