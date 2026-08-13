const MOODS = [
  { value: 1, emoji: "😞", label: "Awful" },
  { value: 2, emoji: "🙁", label: "Low" },
  { value: 3, emoji: "😐", label: "Okay" },
  { value: 4, emoji: "🙂", label: "Good" },
  { value: 5, emoji: "😄", label: "Excellent" },
];

export default function MoodSlider({ value, onChange }) {
  return (
    <div className="mood-slider">
      <div className="mood-options">
        {MOODS.map((m) => (
          <button
            key={m.value}
            type="button"
            className={`mood-option ${value === m.value ? "selected" : ""}`}
            onClick={() => onChange(m.value)}
            aria-label={m.label}
          >
            <span className="mood-emoji">{m.emoji}</span>
          </button>
        ))}
      </div>
      <input
        type="range"
        min="1"
        max="5"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mood-range"
      />
      <div className="mood-label">{MOODS.find((m) => m.value === value)?.label}</div>
    </div>
  );
}
