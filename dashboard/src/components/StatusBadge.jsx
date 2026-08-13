const STYLES = {
  stable: "bg-emerald-100 text-emerald-700 ring-emerald-600/20",
  missed: "bg-amber-100 text-amber-700 ring-amber-600/20",
  concerning: "bg-rose-100 text-rose-700 ring-rose-600/20",
};

const LABELS = {
  stable: "Stable",
  missed: "Missed check-in",
  concerning: "Concerning",
};

export default function StatusBadge({ status }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${STYLES[status]}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {LABELS[status]}
    </span>
  );
}
