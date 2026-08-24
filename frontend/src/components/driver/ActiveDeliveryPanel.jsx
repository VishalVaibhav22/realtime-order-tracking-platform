import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MapPinSimple, Broadcast } from "@phosphor-icons/react";
import Badge from "../common/Badge";
import Button from "../common/Button";
import { api } from "../../services/api";
import { NEXT_STATUS, ACTION_LABELS } from "../../utils/format";

function ActiveDeliveryPanel({ order, sharingLocation, onToggleSharing }) {
  const queryClient = useQueryClient();

  const statusMutation = useMutation({
    mutationFn: (status) => api.patch(`/orders/${order.id}/status`, { status }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["order", order.id] }),
  });

  const next = NEXT_STATUS[order.status];
  const canShareLocation = order.status === "PICKED_UP" || order.status === "IN_TRANSIT";

  return (
    <div className="bg-surface border border-border rounded-xl shadow-[0_4px_12px_rgba(11,19,43,0.08)] flex flex-col gap-5 p-5 h-full overflow-y-auto">
      <div className="flex justify-between items-start border-b border-border pb-4">
        <h2 className="text-lg font-semibold text-primary">
          Order #{order.id.slice(0, 8).toUpperCase()}
        </h2>
        <Badge status={order.status} />
      </div>

      <div className="flex items-start gap-2 text-sm text-text-secondary">
        <MapPinSimple size={18} className="text-primary shrink-0 mt-0.5" />
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-text-muted mb-1">
            Destination
          </p>
          {order.destinationAddress}
        </div>
      </div>

      {canShareLocation && (
        <button
          onClick={onToggleSharing}
          className={`flex items-center justify-center gap-2 text-sm font-semibold py-2.5 rounded border transition-colors ${
            sharingLocation
              ? "bg-accent-light text-accent-hover border-accent/30"
              : "bg-surface text-text-secondary border-border"
          }`}
        >
          <Broadcast size={16} weight={sharingLocation ? "fill" : "regular"} />
          {sharingLocation ? "Live Location Active" : "Share My Location"}
        </button>
      )}

      <div className="flex flex-col gap-2 mt-auto">
        {next && (
          <Button onClick={() => statusMutation.mutate(next)} disabled={statusMutation.isPending}>
            {statusMutation.isPending ? "Updating..." : ACTION_LABELS[next]}
          </Button>
        )}
        {order.status === "IN_TRANSIT" && (
          <>
            <Button
              variant="accent"
              onClick={() => statusMutation.mutate("DELIVERED")}
              disabled={statusMutation.isPending}
            >
              Complete Delivery
            </Button>
            <Button
              variant="danger"
              onClick={() => statusMutation.mutate("FAILED")}
              disabled={statusMutation.isPending}
            >
              Mark Failed
            </Button>
          </>
        )}
        {(order.status === "DELIVERED" || order.status === "FAILED") && (
          <p className="text-sm text-text-secondary text-center py-2">This delivery is complete.</p>
        )}
      </div>
    </div>
  );
}

export default ActiveDeliveryPanel;
