import { useState, type SubmitEvent } from "react";
import { register } from "../api/auth";
import { Link } from "react-router-dom";
import { ApiError } from "../api/types";

export function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submit, setSubmit] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

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

  return (
    <div className="register-form">
      {success ? (
        <p>{success}</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <label htmlFor="username">Username</label>
          <input
            id="username"
            className="oneliner"
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
            className="oneliner"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            required
            autoComplete="email"
            placeholder="Email"
          />
          <label htmlFor="password">Password</label>
          <input
            id="password"
            className="oneliner"
            value={password}
            onChange={(p) => setPassword(p.target.value)}
            type="password"
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
      <Link to="/login">login</Link>
      {success && <p>{success}</p>}
    </div>
  );
}
