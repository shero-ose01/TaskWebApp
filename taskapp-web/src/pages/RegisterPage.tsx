import { useEffect, useState, type SubmitEvent } from "react";
import { register, resendEmailVerification } from "../api/auth";
import { Link } from "react-router-dom";
import { ApiError } from "../api/types";
import { PasswordInput } from "../components/PasswordInput";

export function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submit, setSubmit] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) {
      return;
    }
    const timer = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  async function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    setError(null);
    setSubmit(true);
    try {
      await register({ username, email, password });
      setSuccess("Check your email to verify your account");
    } catch (error) {
      if (error instanceof ApiError && error.status === 409) {
        setError(error.body?.message ?? "Email or Username already taken");
      } else {
        setError("Server Error");
      }
    }
    setSubmit(false);
  }

  async function handleResendEmailVerification() {
    setCooldown(30);
    try {
      await resendEmailVerification(email);
      setSuccess("Sent a new Verification Email");
    } catch {}
  }

  return (
    <div className="register-form">
      {success ? (
        <div>
          <p>{success}</p>
          <button
            type="button"
            onClick={handleResendEmailVerification}
            disabled={cooldown > 0}
          >
            {cooldown <= 0
              ? "Resend Verification Email"
              : "Resend available in " + cooldown}
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <label htmlFor="username">Username</label>
          <input
            id="username"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
            }}
            required
            type="text"
            placeholder="Username"
          />
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
          <button type="submit" disabled={submit}>
            Register
          </button>
        </form>
      )}
      {error && <p>{error}</p>}
      <Link to="/login">Login</Link>
    </div>
  );
}
