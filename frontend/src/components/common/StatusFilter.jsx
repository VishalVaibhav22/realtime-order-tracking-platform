import { ORDER_STATUSES, STATUS_LABELS } from "../../utils/format";

function StatusFilter({ value, onChange }) {
  const options = ["ALL", ...ORDER_STATUSES];

  return (
    <div className="flex gap-2 flex-wrap">
      {options.map((status) => {
        const active = status === "ALL" ? value === null : value === status;

        return (
          <button
            key={status}
            onClick={() => onChange(status === "ALL" ? null : status)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wide border transition-colors ${
              active
                ? "bg-primary text-white border-primary"
                : "bg-surface text-text-secondary border-border hover:border-primary"
            }`}
          >
            {status === "ALL" ? "All" : STATUS_LABELS[status]}
          </button>
        );
      })}
    </div>
  );
}

export default StatusFilter;
