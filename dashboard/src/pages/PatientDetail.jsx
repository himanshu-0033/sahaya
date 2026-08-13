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
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <Link to="/patients" className="text-sm text-indigo-600 hover:text-indigo-800">
            ← Back to patients
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8 space-y-8">
        {loading && <p className="text-slate-500">Loading…</p>}
        {error && <p className="text-rose-600">{error}</p>}

        {data && (
          <>
            <div>
              <h1 className="text-2xl font-semibold text-slate-900">{data.patient.name}</h1>
              <p className="text-sm text-slate-500">
                {data.patient.email} · {data.patient.streak}-day streak
              </p>
            </div>

            <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-sm font-medium text-slate-500 mb-4">30-day mood trend</h2>
              <MoodChart history={data.moodHistory} />
            </section>

            <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-sm font-medium text-slate-500 mb-4">Word cloud</h2>
              <WordCloud words={data.wordCloud} />
            </section>

            <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-sm font-medium text-slate-500 mb-4">Flagged check-ins</h2>
              {data.flaggedCheckIns.length === 0 && (
                <p className="text-sm text-slate-400">No flagged check-ins — nothing concerning has come up.</p>
              )}
              <div className="space-y-4">
                {data.flaggedCheckIns.map((c) => (
                  <div key={c.date} className="rounded-lg bg-rose-50 border border-rose-100 p-4">
                    <p className="text-sm font-medium text-rose-700 mb-1">
                      {c.date} · mood {c.averageMood.toFixed(1)}
                    </p>
                    <ul className="text-sm text-rose-900 space-y-0.5">
                      {c.responses.map((r) => (
                        <li key={r.prompt}>
                          <span className="text-rose-500">{r.prompt}:</span> {r.word}
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
