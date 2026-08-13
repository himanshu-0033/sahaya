export default function WordCloud({ words }) {
  if (words.length === 0) return <p className="text-sm text-slate-400">No words submitted yet.</p>;

  const max = Math.max(...words.map((w) => w.count));

  return (
    <div className="flex flex-wrap gap-x-3 gap-y-2 items-baseline">
      {words.map((w) => {
        const scale = 0.85 + (w.count / max) * 1.15;
        return (
          <span
            key={w.word}
            style={{ fontSize: `${scale}rem` }}
            className="text-slate-700 font-medium"
            title={`${w.count}×`}
          >
            {w.word}
          </span>
        );
      })}
    </div>
  );
}
