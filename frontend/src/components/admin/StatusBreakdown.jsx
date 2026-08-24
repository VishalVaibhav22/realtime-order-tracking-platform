import { STATUS_LABELS, ORDER_STATUSES } from "../../utils/format";

function StatusBreakdown({ orders }) {
  const counts = ORDER_STATUSES.reduce((acc, status) => {
    acc[status] = orders.filter((o) => o.status === status).length;
    return acc;
  }, {});

  return (
    <div className="bg-surface border border-border rounded-lg p-5">
      <p className="text-xs font-semibold uppercase tracking-widest text-text-muted mb-4">
        Status Distribution
      </p>
      <div className="flex flex-col gap-2">
        {ORDER_STATUSES.map((status) => (
          <div key={status} className="flex items-center justify-between text-sm">
            <span className="text-text-secondary">{STATUS_LABELS[status]}</span>
            <span className="font-semibold text-primary">{counts[status]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default StatusBreakdown;
