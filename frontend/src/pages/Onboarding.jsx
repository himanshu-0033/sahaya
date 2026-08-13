import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";
import { useAuth } from "../context/AuthContext";

export default function Onboarding() {
  const [mode, setMode] = useState("login"); // "login" | "signup"
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isCaregiver, setIsCaregiver] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data =
        mode === "login"
          ? await api.login(email, password)
          : await api.signup(name, email, password, isCaregiver ? "caregiver" : "patient");
      login(data.token, data.user);
      if (data.user.role === "caregiver") {
        setError("Caregiver account created. Log in at the caregiver dashboard instead.");
        setLoading(false);
        return;
      }
      navigate("/checkin");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="screen onboarding">
      <div className="brand">
        <div className="brand-mark" aria-hidden="true" />
        <h1>Sahaya</h1>
        <p className="tagline">A calm moment, every day.</p>
      </div>

      <form className="card" onSubmit={handleSubmit}>
        <div className="tab-switch">
          <button
            type="button"
            className={mode === "login" ? "active" : ""}
            onClick={() => setMode("login")}
          >
            Log in
          </button>
          <button
            type="button"
            className={mode === "signup" ? "active" : ""}
            onClick={() => setMode("signup")}
          >
            Sign up
          </button>
        </div>

        {mode === "signup" && (
          <>
            <input
              className="input"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <label className="caregiver-check">
              <input type="checkbox" checked={isCaregiver} onChange={(e) => setIsCaregiver(e.target.checked)} />
              I'm a caregiver / counselor
            </label>
          </>
        )}
        <input
          className="input"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          className="input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
        />

        {error && <div className="error-text">{error}</div>}

        <button className="btn-primary" type="submit" disabled={loading}>
          {loading ? "Please wait…" : mode === "login" ? "Log in" : "Create account"}
        </button>

        <button type="button" className="btn-ghost" disabled title="Coming soon">
          Continue with Face ID
        </button>
      </form>
    </div>
  );
}
