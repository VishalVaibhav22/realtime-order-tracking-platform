import Badge from "../common/Badge";
import Avatar from "../common/Avatar";

function DriverTable({ drivers }) {
  return (
    <div className="overflow-x-auto border border-border rounded-lg">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-background text-left">
            <th className="px-4 py-3 font-semibold text-text-muted text-xs uppercase tracking-wide">
              Driver
            </th>
            <th className="px-4 py-3 font-semibold text-text-muted text-xs uppercase tracking-wide">
              Vehicle
            </th>
            <th className="px-4 py-3 font-semibold text-text-muted text-xs uppercase tracking-wide">
              Availability
            </th>
            <th className="px-4 py-3 font-semibold text-text-muted text-xs uppercase tracking-wide">
              Active Order
            </th>
          </tr>
        </thead>
        <tbody>
          {drivers.map((driver) => (
            <tr key={driver.id} className="border-b border-border last:border-0">
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <Avatar name={driver.user.name} size={28} />
                  {driver.user.name}
                </div>
              </td>
              <td className="px-4 py-3 text-text-secondary">{driver.vehicleNumber}</td>
              <td className="px-4 py-3">
                <span
                  className={`text-xs font-semibold px-2 py-1 rounded-full ${
                    driver.isAvailable
                      ? "bg-success/10 text-success"
                      : "bg-background text-text-muted border border-border"
                  }`}
                >
                  {driver.isAvailable ? "Available" : "Unavailable"}
                </span>
              </td>
              <td className="px-4 py-3 text-text-secondary">
                {driver.activeOrder ? (
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs">
                      #{driver.activeOrder.id.slice(0, 8).toUpperCase()}
                    </span>
                    <Badge status={driver.activeOrder.status} />
                  </div>
                ) : (
                  <span className="text-text-muted italic">None</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DriverTable;
