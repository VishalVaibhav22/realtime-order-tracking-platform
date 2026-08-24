import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Badge from "../common/Badge";
import Button from "../common/Button";
import { api } from "../../services/api";
import { NEXT_STATUS, ACTION_LABELS } from "../../utils/format";

function AssignedOrderCard({ order }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const acceptMutation = useMutation({
    mutationFn: () => api.patch(`/orders/${order.id}/accept`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["driverOrders"] });
      queryClient.invalidateQueries({ queryKey: ["availableOrders"] });
    },
  });

  const statusMutation = useMutation({
    mutationFn: (status) => api.patch(`/orders/${order.id}/status`, { status }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["driverOrders"] }),
  });

  function renderAction() {
    if (order.status === "PLACED") {
      return (
        <Button onClick={() => acceptMutation.mutate()} disabled={acceptMutation.isPending} className="w-full">
          {acceptMutation.isPending ? "Accepting..." : "Accept"}
        </Button>
      );
    }

    const next = NEXT_STATUS[order.status];
    if (next) {
      return (
        <Button
          onClick={() => statusMutation.mutate(next)}
          disabled={statusMutation.isPending}
          className="w-full"
        >
          {statusMutation.isPending ? "Updating..." : ACTION_LABELS[next]}
        </Button>
      );
    }

    if (order.status === "IN_TRANSIT") {
      return (
        <Button variant="secondary" onClick={() => navigate(`/driver/orders/${order.id}`)} className="w-full">
          Open Active Delivery
        </Button>
      );
    }

    return null;
  }

  return (
    <div className="bg-surface border border-border rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="font-mono text-xs text-text-muted">
          #{order.id.slice(0, 8).toUpperCase()}
        </span>
        <Badge status={order.status} />
      </div>
      <div className="text-sm text-text-secondary mb-4 flex flex-col gap-0.5">
        <p>Pickup: {order.pickupAddress}</p>
        <p>Dropoff: {order.destinationAddress}</p>
      </div>
      {renderAction()}
    </div>
  );
}

export default AssignedOrderCard;
