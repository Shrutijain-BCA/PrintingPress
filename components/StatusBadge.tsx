type Status = "pending" | "preparing" | "ready";

export default function StatusBadge({ status }: { status: Status }) {
  const styles = {
    pending: "bg-slate-100 text-slate-600",
    preparing: "bg-amber-100 text-amber-700",
    ready: "bg-green-100 text-green-700",
  };

  const labels = {
    pending: "Pending",
    preparing: "Preparing",
    ready: "Ready",
  };

  return (
    <span
      className={`px-3 py-1 text-sm rounded-full ${styles[status]}`}
    >
      {labels[status]}
    </span>
  );
}
