import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../api";
import { useAuth } from "../context/AuthContext";
import MoodChart from "../components/MoodChart";
import WordCloud from "../components/WordCloud";

export default function PatientDetail() {
  const { id } = useParams();
  const { token } = useAuth();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api
      .patient(id, token)
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id, token]);

  return (
    <div className="min-h-screen bg-bg">
      <header className="border-b border-border bg-surface">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <Link to="/patients" className="text-sm text-brand-dark hover:text-brand">
            ← Back to patients
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8 space-y-6">
        {loading && <p className="text-ink-muted text-sm">Loading…</p>}
        {error && <p className="text-concerning text-sm">{error}</p>}

        {data && (
          <>
            <div>
              <h1 className="text-xl font-semibold text-ink">{data.patient.name}</h1>
              <p className="text-sm text-ink-muted">
                {data.patient.email} · {data.patient.streak}-day streak
              </p>
            </div>

            <section className="rounded-xl border border-border bg-surface p-6">
              <h2 className="text-sm font-medium text-ink-muted mb-4">30-day mood trend</h2>
              <MoodChart history={data.moodHistory} />
            </section>

            <section className="rounded-xl border border-border bg-surface p-6">
              <h2 className="text-sm font-medium text-ink-muted mb-4">Word cloud</h2>
              <WordCloud words={data.wordCloud} />
            </section>

            <section className="rounded-xl border border-border bg-surface p-6">
              <h2 className="text-sm font-medium text-ink-muted mb-4">Flagged check-ins</h2>
              {data.flaggedCheckIns.length === 0 && (
                <p className="text-sm text-ink-muted">No flagged check-ins — nothing concerning has come up.</p>
              )}
              <div className="space-y-3">
                {data.flaggedCheckIns.map((c) => (
                  <div key={c.date} className="rounded-lg bg-concerning-soft p-4">
                    <p className="text-sm font-medium text-concerning mb-1">
                      {c.date} · mood {c.averageMood.toFixed(1)}
                    </p>
                    <ul className="text-sm text-ink space-y-0.5">
                      {c.responses.map((r) => (
                        <li key={r.prompt}>
                          <span className="text-ink-muted">{r.prompt}:</span> {r.word}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}
