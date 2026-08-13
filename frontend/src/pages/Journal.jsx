import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";
import { useAuth } from "../context/AuthContext";

function moodClass(avg) {
  if (avg == null) return "";
  if (avg <= 2) return "mood-low";
  if (avg <= 3.5) return "mood-mid";
  return "mood-high";
}

export default function Journal() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { token, user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    api
      .history(token)
      .then((data) => setEntries(data.entries))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [token]);

  const entryByDate = useMemo(() => {
    const map = new Map();
    entries.forEach((e) => map.set(e.date, e));
    return map;
  }, [entries]);

  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const firstDay = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const leadingBlanks = firstDay.getDay();
  const monthLabel = firstDay.toLocaleString(undefined, { month: "long", year: "numeric" });

  const cells = [
    ...Array.from({ length: leadingBlanks }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  return (
    <div className="screen journal">
      <div className="journal-header">
        <div>
          <h2>Your journal</h2>
          <p className="streak-badge">{user?.streak ?? 0}-day streak</p>
        </div>
        <button className="btn-ghost small" onClick={() => { logout(); navigate("/"); }}>
          Log out
        </button>
      </div>

      <p className="month-label">{monthLabel}</p>

      {loading && <p>Loading…</p>}
      {error && <div className="error-text">{error}</div>}

      {!loading && !error && (
        <>
          <div className="calendar-grid">
            {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
              <div key={`h-${i}`} className="calendar-heading">
                {d}
              </div>
            ))}
            {cells.map((day, i) => {
              if (!day) return <div key={`b-${i}`} className="calendar-cell empty" />;
              const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
              const entry = entryByDate.get(dateStr);
              return (
                <div key={dateStr} className={`calendar-cell ${moodClass(entry?.averageMood)}`}>
                  {day}
                </div>
              );
            })}
          </div>

          <div className="journal-list">
            {[...entries].reverse().map((e) => (
              <div key={e.date} className={`journal-entry ${moodClass(e.averageMood)}`}>
                <span className="journal-date">{e.date}</span>
                <span className="journal-quote">{e.quote}</span>
              </div>
            ))}
            {entries.length === 0 && <p className="empty-state">No check-ins yet — come back tomorrow!</p>}
          </div>
        </>
      )}

      <button className="btn-primary" onClick={() => navigate("/checkin")}>
        Back to check-in
      </button>
    </div>
  );
}
