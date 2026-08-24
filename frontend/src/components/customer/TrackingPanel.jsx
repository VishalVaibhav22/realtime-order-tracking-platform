import Badge from "../common/Badge";
import EtaSummary from "./EtaSummary";
import DriverInfoCard from "./DriverInfoCard";
import StatusTimeline from "./StatusTimeline";

const TERMINAL_STATUSES = ["DELIVERED", "FAILED"];

function TrackingPanel({ order, eta, connected }) {
  const isTerminal = TERMINAL_STATUSES.includes(order.status);

  return (
    <div className="bg-surface border border-border rounded-xl shadow-[0_4px_12px_rgba(11,19,43,0.08)] flex flex-col gap-5 p-5 overflow-y-auto h-full">
      <div className="flex justify-between items-start border-b border-border pb-4">
        <div>
          <h2 className="text-lg font-semibold text-primary">
            Order #{order.id.slice(0, 8).toUpperCase()}
          </h2>
          <p className="text-xs text-text-muted mt-1">
            {connected ? "Live tracking active" : "Connecting..."}
          </p>
        </div>
        <Badge status={order.status} />
      </div>

      {!isTerminal && <EtaSummary eta={eta} />}
      <DriverInfoCard driver={order.driver} />

      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-text-muted mb-3">
          Delivery Progress
        </p>
        <StatusTimeline order={order} />
      </div>
    </div>
  );
}

export default TrackingPanel;
