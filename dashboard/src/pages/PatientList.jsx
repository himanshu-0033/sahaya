import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api";
import { useAuth } from "../context/AuthContext";
import StatusBadge from "../components/StatusBadge";

const ORDER = { concerning: 0, missed: 1, stable: 2 };

export default function PatientList() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { token, user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    api
      .patients(token)
      .then((data) => setPatients(data.patients))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [token]);

  const sorted = [...patients].sort((a, b) => ORDER[a.status] - ORDER[b.status]);

  return (
    <div className="min-h-screen bg-bg">
      <header className="border-b border-border bg-surface">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <p className="font-semibold text-ink">Sahaya · Caregiver</p>
            <p className="text-sm text-ink-muted">Signed in as {user?.name}</p>
          </div>
          <button
            onClick={() => {
              logout();
              navigate("/");
            }}
            className="text-sm text-ink-muted hover:text-ink transition-colors"
          >
            Log out
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        <h1 className="text-lg font-medium text-ink mb-1">Your patients</h1>
        <p className="text-sm text-ink-muted mb-6">{patients.length} assigned</p>

        {loading && <p className="text-ink-muted text-sm">Loading…</p>}
        {error && <p className="text-concerning text-sm">{error}</p>}

        {!loading && !error && patients.length === 0 && (
          <p className="text-ink-muted text-sm max-w-md">
            No patients are assigned to you yet. Have a patient sign up in the main app — they're auto-assigned to the
            first caregiver on record.
          </p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sorted.map((p) => (
            <Link
              key={p.id}
              to={`/patients/${p.id}`}
              className="block rounded-xl border border-border bg-surface p-5 hover:border-brand/40 transition-colors"
            >
              <div className="flex items-start justify-between mb-3 gap-3">
                <div className="min-w-0">
                  <p className="font-medium text-ink truncate">{p.name}</p>
                  <p className="text-xs text-ink-muted truncate">{p.email}</p>
                </div>
                <StatusBadge status={p.status} />
              </div>
              <p className="text-sm text-ink-muted">
                {p.streak}-day streak · last check-in {p.lastCheckInDate || "never"}
              </p>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
