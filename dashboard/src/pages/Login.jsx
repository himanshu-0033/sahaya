import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await api.login(email, password);
      if (data.user.role !== "caregiver") {
        setError("This account isn't a caregiver account.");
        return;
      }
      login(data.token, data.user);
      navigate("/patients");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg">
      <form onSubmit={handleSubmit} className="w-full max-w-sm bg-surface rounded-2xl border border-border p-8 space-y-4">
        <div className="mb-2">
          <div className="w-10 h-10 rounded-xl bg-brand-soft flex items-center justify-center mb-4">
            <span className="text-brand-dark font-semibold">S</span>
          </div>
          <h1 className="text-xl font-semibold text-ink">Sahaya</h1>
          <p className="text-sm text-ink-muted">Caregiver dashboard</p>
        </div>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full rounded-lg border border-border bg-bg px-3 py-2.5 text-sm text-ink placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-brand/40"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full rounded-lg border border-border bg-bg px-3 py-2.5 text-sm text-ink placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-brand/40"
        />

        {error && <p className="text-sm text-concerning">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-brand text-white font-medium py-2.5 hover:bg-brand-dark transition-colors disabled:opacity-60"
        >
          {loading ? "Signing in…" : "Log in"}
        </button>

        <p className="text-xs text-ink-muted pt-2 border-t border-border">
          Create a caregiver account from the patient app's sign-up screen (check "I'm a caregiver / counselor").
        </p>
      </form>
    </div>
  );
}
