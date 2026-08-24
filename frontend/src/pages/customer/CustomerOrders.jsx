import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { api } from "../../services/api";
import LoadingState from "../../components/common/LoadingState";
import ErrorState from "../../components/common/ErrorState";
import StatusFilter from "../../components/common/StatusFilter";
import OrderList from "../../components/customer/OrderList";

function CustomerOrders() {
  const [status, setStatus] = useState(null);
  const navigate = useNavigate();

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["orders", status],
    queryFn: () => api.get(status ? `/orders?status=${status}` : "/orders"),
  });

  return (
    <div className="p-6 md:p-10 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-1">
        <h1 className="text-2xl font-bold text-primary">Your Orders</h1>
        <button
          onClick={() => navigate("/customer/orders/new")}
          className="bg-primary text-white text-sm font-semibold px-4 py-2 rounded"
        >
          + New Order
        </button>
      </div>
      <p className="text-text-secondary mb-6">Track and manage your deliveries.</p>

      <div className="mb-6">
        <StatusFilter value={status} onChange={setStatus} />
      </div>

      {isLoading && <LoadingState label="Loading orders" />}
      {isError && <ErrorState message={error.message} onRetry={refetch} />}
      {data && <OrderList orders={data.orders} onSelect={(id) => navigate(`/customer/orders/${id}`)} />}
    </div>
  );
}

export default CustomerOrders;
