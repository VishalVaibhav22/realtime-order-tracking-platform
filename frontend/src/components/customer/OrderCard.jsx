import { Storefront, MapPinSimple, ArrowRight } from "@phosphor-icons/react";
import Badge from "../common/Badge";
import { formatDateTime } from "../../utils/format";

function OrderCard({ order, onClick, compact }) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left bg-surface border border-border rounded-lg p-4 hover:border-primary transition-colors"
    >
      <div className="flex items-center justify-between mb-3">
        <span className="font-mono text-xs text-text-muted">
          #{order.id.slice(0, 8).toUpperCase()}
        </span>
        <Badge status={order.status} />
      </div>
      {!compact && (
        <div className="flex flex-col gap-1.5 mb-3 text-sm">
          <div className="flex items-center gap-2 text-text-secondary">
            <Storefront size={16} className="text-warning shrink-0" />
            <span className="truncate">{order.pickupAddress}</span>
          </div>
          <div className="flex items-center gap-2 text-text-secondary">
            <MapPinSimple size={16} className="text-primary shrink-0" />
            <span className="truncate">{order.destinationAddress}</span>
          </div>
        </div>
      )}
      <div className="flex items-center justify-between text-xs text-text-muted">
        <span>{formatDateTime(order.createdAt)}</span>
        <ArrowRight size={16} />
      </div>
    </button>
  );
}

export default OrderCard;
