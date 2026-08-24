import { useQuery } from "@tanstack/react-query";
import { Package, Truck } from "@phosphor-icons/react";
import { api } from "../../services/api";
import LoadingState from "../../components/common/LoadingState";
import ErrorState from "../../components/common/ErrorState";
import StatusBreakdown from "../../components/admin/StatusBreakdown";

const ACTIVE_STATUSES = ["ACCEPTED", "PICKED_UP", "IN_TRANSIT"];

function AdminDashboard() {
  const ordersQuery = useQuery({ queryKey: ["adminOrders"], queryFn: () => api.get("/admin/orders") });
  const driversQuery = useQuery({ queryKey: ["adminDrivers"], queryFn: () => api.get("/admin/drivers") });

  if (ordersQuery.isLoading || driversQuery.isLoading) {
    return <LoadingState label="Loading overview" />;
  }
  if (ordersQuery.isError) {
    return <ErrorState message={ordersQuery.error.message} onRetry={ordersQuery.refetch} />;
  }
  if (driversQuery.isError) {
    return <ErrorState message={driversQuery.error.message} onRetry={driversQuery.refetch} />;
  }

  const orders = ordersQuery.data.orders;
  const drivers = driversQuery.data.drivers;
  const activeOrders = orders.filter((o) => ACTIVE_STATUSES.includes(o.status));

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-primary">Operational Overview</h1>
      <p className="text-text-secondary mt-1">Live snapshot of orders and drivers.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
        <div className="bg-surface border border-border rounded-lg p-5 flex items-center gap-4">
          <div className="w-11 h-11 rounded-lg bg-accent-light flex items-center justify-center shrink-0">
            <Package size={22} className="text-accent-hover" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-text-muted">
              Active Orders
            </p>
            <p className="text-2xl font-bold text-primary">{activeOrders.length}</p>
          </div>
        </div>
        <div className="bg-surface border border-border rounded-lg p-5 flex items-center gap-4">
          <div className="w-11 h-11 rounded-lg bg-accent-light flex items-center justify-center shrink-0">
            <Truck size={22} className="text-accent-hover" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-text-muted">
              Total Drivers
            </p>
            <p className="text-2xl font-bold text-primary">{drivers.length}</p>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <StatusBreakdown orders={orders} />
      </div>
    </div>
  );
}

export default AdminDashboard;
