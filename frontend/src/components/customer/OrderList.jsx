import { Package } from "@phosphor-icons/react";
import EmptyState from "../common/EmptyState";
import OrderCard from "./OrderCard";

function OrderList({ orders, onSelect }) {
  if (orders.length === 0) {
    return (
      <EmptyState
        icon={Package}
        title="No orders found"
        description="Try a different status filter"
      />
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {orders.map((order) => (
        <OrderCard key={order.id} order={order} onClick={() => onSelect(order.id)} />
      ))}
    </div>
  );
}

export default OrderList;
