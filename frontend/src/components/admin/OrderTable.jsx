import { useNavigate } from "react-router-dom";
import Badge from "../common/Badge";

function OrderTable({ orders }) {
  const navigate = useNavigate();

  return (
    <div className="overflow-x-auto border border-border rounded-lg">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-background text-left">
            <th className="px-4 py-3 font-semibold text-text-muted text-xs uppercase tracking-wide">
              Order
            </th>
            <th className="px-4 py-3 font-semibold text-text-muted text-xs uppercase tracking-wide">
              Customer
            </th>
            <th className="px-4 py-3 font-semibold text-text-muted text-xs uppercase tracking-wide">
              Status
            </th>
            <th className="px-4 py-3 font-semibold text-text-muted text-xs uppercase tracking-wide">
              Driver
            </th>
            <th className="px-4 py-3 font-semibold text-text-muted text-xs uppercase tracking-wide">
              Destination
            </th>
            <th className="px-4 py-3 font-semibold text-text-muted text-xs uppercase tracking-wide">
              ETA
            </th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr
              key={order.id}
              onClick={() => navigate(`/admin/orders/${order.id}`)}
              className="border-b border-border last:border-0 hover:bg-background cursor-pointer"
            >
              <td className="px-4 py-3 font-mono text-xs text-text-muted">
                #{order.id.slice(0, 8).toUpperCase()}
              </td>
              <td className="px-4 py-3">{order.customer.name}</td>
              <td className="px-4 py-3">
                <Badge status={order.status} />
              </td>
              <td className="px-4 py-3 text-text-secondary">
                {order.driver ? order.driver.user.name : <span className="italic">Unassigned</span>}
              </td>
              <td className="px-4 py-3 text-text-secondary truncate max-w-[220px]">
                {order.destinationAddress}
              </td>
              <td className="px-4 py-3 text-text-secondary">
                {order.eta ? order.eta.label || `${order.eta.minutes} min` : "--"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default OrderTable;
