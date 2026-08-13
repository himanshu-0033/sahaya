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
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-slate-900">Sahaya · Caregiver</h1>
            <p className="text-sm text-slate-500">Signed in as {user?.name}</p>
          </div>
          <button
            onClick={() => {
              logout();
              navigate("/");
            }}
            className="text-sm text-slate-500 hover:text-slate-800"
          >
            Log out
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        <h2 className="text-xl font-semibold text-slate-900 mb-1">Your patients</h2>
        <p className="text-sm text-slate-500 mb-6">{patients.length} assigned</p>

        {loading && <p className="text-slate-500">Loading…</p>}
        {error && <p className="text-rose-600">{error}</p>}

        {!loading && !error && patients.length === 0 && (
          <p className="text-slate-500">
            No patients are assigned to you yet. Have a patient sign up in the main app — they're auto-assigned to the
            first caregiver on record.
          </p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sorted.map((p) => (
            <Link
              key={p.id}
              to={`/patients/${p.id}`}
              className="block rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-medium text-slate-900">{p.name}</p>
                  <p className="text-xs text-slate-500">{p.email}</p>
                </div>
                <StatusBadge status={p.status} />
              </div>
              <p className="text-sm text-slate-500">
                {p.streak}-day streak · last check-in {p.lastCheckInDate || "never"}
              </p>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
