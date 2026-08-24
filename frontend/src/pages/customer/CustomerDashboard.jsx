import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Package } from "@phosphor-icons/react";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../services/api";
import LoadingState from "../../components/common/LoadingState";
import ErrorState from "../../components/common/ErrorState";
import EmptyState from "../../components/common/EmptyState";
import OrderCard from "../../components/customer/OrderCard";

const ACTIVE_STATUSES = ["PLACED", "ACCEPTED", "PICKED_UP", "IN_TRANSIT"];

function CustomerDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["orders"],
    queryFn: () => api.get("/orders"),
  });

  if (isLoading) return <LoadingState label="Loading your orders" />;
  if (isError) return <ErrorState message={error.message} onRetry={refetch} />;

  const orders = data.orders;
  const activeOrders = orders.filter((o) => ACTIVE_STATUSES.includes(o.status));
  const recentOrders = orders.filter((o) => !ACTIVE_STATUSES.includes(o.status)).slice(0, 5);

  return (
    <div className="p-6 md:p-10 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-primary">Good day, {user.name.split(" ")[0]}.</h1>
      <p className="text-text-secondary mt-1">Here's what's happening with your deliveries.</p>

      <div className="flex items-center justify-between mt-10 mb-4">
        <h2 className="text-xl font-semibold text-primary">Active Orders</h2>
        <button
          onClick={() => navigate("/customer/orders/new")}
          className="text-accent text-sm font-semibold"
        >
          + New Order
        </button>
      </div>

      {activeOrders.length === 0 ? (
        <EmptyState
          icon={Package}
          title="No active orders"
          description="Create an order to start tracking it in real time"
        />
      ) : (
        <div className="flex flex-col gap-3">
          {activeOrders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onClick={() => navigate(`/customer/orders/${order.id}`)}
            />
          ))}
        </div>
      )}

      <div className="flex items-center justify-between mt-10 mb-4">
        <h2 className="text-xl font-semibold text-primary">Recent Orders</h2>
        <button
          onClick={() => navigate("/customer/orders")}
          className="text-text-secondary text-sm font-semibold hover:text-primary"
        >
          View All
        </button>
      </div>

      {recentOrders.length === 0 ? (
        <EmptyState icon={Package} title="No past orders yet" />
      ) : (
        <div className="flex flex-col gap-3">
          {recentOrders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onClick={() => navigate(`/customer/orders/${order.id}`)}
              compact
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default CustomerDashboard;
