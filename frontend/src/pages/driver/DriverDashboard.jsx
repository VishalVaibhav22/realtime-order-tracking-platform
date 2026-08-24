import { useQuery } from "@tanstack/react-query";
import { Package } from "@phosphor-icons/react";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../services/api";
import LoadingState from "../../components/common/LoadingState";
import ErrorState from "../../components/common/ErrorState";
import EmptyState from "../../components/common/EmptyState";
import AssignedOrderCard from "../../components/driver/AssignedOrderCard";

function DriverDashboard() {
  const { user } = useAuth();

  const assignedQuery = useQuery({
    queryKey: ["driverOrders"],
    queryFn: () => api.get("/drivers/orders"),
  });

  const availableQuery = useQuery({
    queryKey: ["availableOrders"],
    queryFn: () => api.get("/drivers/available"),
  });

  if (assignedQuery.isLoading || availableQuery.isLoading) {
    return <LoadingState label="Loading your deliveries" />;
  }
  if (assignedQuery.isError) {
    return <ErrorState message={assignedQuery.error.message} onRetry={assignedQuery.refetch} />;
  }
  if (availableQuery.isError) {
    return <ErrorState message={availableQuery.error.message} onRetry={availableQuery.refetch} />;
  }

  const assignedOrders = assignedQuery.data.orders;
  const availableOrders = availableQuery.data.orders;

  return (
    <div className="p-6 md:p-10 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-primary">Welcome back, {user.name.split(" ")[0]}.</h1>
      <p className="text-text-secondary mt-1">Vehicle: {user.driverProfile?.vehicleNumber}</p>

      <div className="mt-10 mb-4">
        <h2 className="text-xl font-semibold text-primary">Available Orders</h2>
        <p className="text-sm text-text-secondary">Orders you can accept</p>
      </div>

      {availableOrders.length === 0 ? (
        <EmptyState icon={Package} title="No orders waiting for a driver right now" />
      ) : (
        <div className="flex flex-col gap-3">
          {availableOrders.map((order) => (
            <AssignedOrderCard key={order.id} order={order} />
          ))}
        </div>
      )}

      <div className="mt-10 mb-4">
        <h2 className="text-xl font-semibold text-primary">My Orders</h2>
        <p className="text-sm text-text-secondary">Orders assigned to you</p>
      </div>

      {assignedOrders.length === 0 ? (
        <EmptyState
          icon={Package}
          title="No assigned orders"
          description="Accept an order above to get started"
        />
      ) : (
        <div className="flex flex-col gap-3">
          {assignedOrders.map((order) => (
            <AssignedOrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
}

export default DriverDashboard;
