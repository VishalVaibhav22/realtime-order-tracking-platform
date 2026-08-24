import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Package } from "@phosphor-icons/react";
import { api } from "../../services/api";
import LoadingState from "../../components/common/LoadingState";
import ErrorState from "../../components/common/ErrorState";
import EmptyState from "../../components/common/EmptyState";
import StatusFilter from "../../components/common/StatusFilter";
import OrderTable from "../../components/admin/OrderTable";

function AdminOrders() {
  const [status, setStatus] = useState(null);

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["adminOrders", status],
    queryFn: () => api.get(status ? `/admin/orders?status=${status}` : "/admin/orders"),
  });

  return (
    <div className="p-6 md:p-10">
      <h1 className="text-2xl font-bold text-primary mb-1">All Orders</h1>
      <p className="text-text-secondary mb-6">Every order in the system.</p>

      <div className="mb-6">
        <StatusFilter value={status} onChange={setStatus} />
      </div>

      {isLoading && <LoadingState label="Loading orders" />}
      {isError && <ErrorState message={error.message} onRetry={refetch} />}
      {data &&
        (data.orders.length === 0 ? (
          <EmptyState
            icon={Package}
            title="No orders found"
            description="Try a different status filter"
          />
        ) : (
          <OrderTable orders={data.orders} />
        ))}
    </div>
  );
}

export default AdminOrders;
