const STYLES = {
  stable: "bg-stable-soft text-stable",
  missed: "bg-missed-soft text-missed",
  concerning: "bg-concerning-soft text-concerning",
};

const LABELS = {
  stable: "Stable",
  missed: "Missed check-in",
  concerning: "Concerning",
};

export default function StatusBadge({ status }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${STYLES[status]}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {LABELS[status]}
    </span>
  );
}
