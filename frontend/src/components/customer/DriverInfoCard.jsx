import { CarProfile } from "@phosphor-icons/react";
import Avatar from "../common/Avatar";

function DriverInfoCard({ driver }) {
  if (!driver) {
    return (
      <div className="flex items-center gap-3 p-3 bg-background rounded-lg border border-border text-text-secondary text-sm">
        <CarProfile size={20} />
        Waiting for a driver to be assigned
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 p-3 bg-background rounded-lg border border-border">
      <Avatar name={driver.user.name} size={40} />
      <div>
        <p className="font-semibold text-primary text-sm">{driver.user.name}</p>
        <p className="text-xs text-text-secondary">Vehicle: {driver.vehicleNumber}</p>
      </div>
    </div>
  );
}

export default DriverInfoCard;
