const WIDTH = 640;
const HEIGHT = 180;
const PAD = 24;

export default function MoodChart({ history }) {
  if (history.length === 0) {
    return <p className="text-sm text-ink-muted">No check-ins yet.</p>;
  }

  const xStep = history.length > 1 ? (WIDTH - PAD * 2) / (history.length - 1) : 0;
  const yFor = (mood) => HEIGHT - PAD - ((mood - 1) / 4) * (HEIGHT - PAD * 2);

  const points = history.map((h, i) => ({
    x: PAD + i * xStep,
    y: yFor(h.averageMood),
    flagged: h.flagged,
    date: h.date,
    mood: h.averageMood,
  }));

  const path = points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");

  return (
    <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="w-full h-auto">
      {[1, 2, 3, 4, 5].map((m) => (
        <line
          key={m}
          x1={PAD}
          x2={WIDTH - PAD}
          y1={yFor(m)}
          y2={yFor(m)}
          stroke="var(--color-border)"
          strokeWidth="1"
        />
      ))}
      <path d={path} fill="none" stroke="var(--color-brand)" strokeWidth="2" />
      {points.map((p) => (
        <circle
          key={p.date}
          cx={p.x}
          cy={p.y}
          r={p.flagged ? 5 : 3.5}
          fill={p.flagged ? "var(--color-concerning)" : "var(--color-brand)"}
        >
          <title>
            {p.date}: mood {p.mood.toFixed(1)}
            {p.flagged ? " (flagged)" : ""}
          </title>
        </circle>
      ))}
    </svg>
  );
}
