import { Check, Truck, X } from "@phosphor-icons/react";
import { formatDateTime } from "../../utils/format";

const STEPS = ["PLACED", "ACCEPTED", "PICKED_UP", "IN_TRANSIT", "DELIVERED"];
const STEP_LABELS = {
  PLACED: "Placed",
  ACCEPTED: "Accepted",
  PICKED_UP: "Picked Up",
  IN_TRANSIT: "In Transit",
  DELIVERED: "Delivered",
};

function StatusTimeline({ order }) {
  const failed = order.status === "FAILED";
  const currentIndex = STEPS.indexOf(failed ? "IN_TRANSIT" : order.status);

  return (
    <div className="flex flex-col relative ml-3">
      <div className="absolute left-[11px] top-3 bottom-8 w-[2px] bg-border" />
      {STEPS.map((step, i) => {
        const done = i <= currentIndex;
        const isInProgress = step === "IN_TRANSIT" && order.status === "IN_TRANSIT";

        return (
          <div key={step} className="flex gap-3 relative z-10 pb-6 last:pb-0">
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 border-2 border-white ${
                isInProgress ? "bg-accent" : done ? "bg-primary" : "bg-border"
              }`}
            >
              {done && !isInProgress && <Check size={13} weight="bold" className="text-white" />}
              {isInProgress && <Truck size={13} weight="fill" className="text-white" />}
            </div>
            <div>
              <p
                className={`text-xs font-semibold uppercase tracking-wide ${
                  done ? "text-primary" : "text-text-muted"
                }`}
              >
                {STEP_LABELS[step]}
              </p>
              {step === "PLACED" && (
                <p className="text-xs text-text-muted mt-0.5">{formatDateTime(order.createdAt)}</p>
              )}
              {step === "DELIVERED" && order.status === "DELIVERED" && (
                <p className="text-xs text-text-muted mt-0.5">{formatDateTime(order.deliveredAt)}</p>
              )}
            </div>
          </div>
        );
      })}
      {failed && (
        <div className="flex gap-3 relative z-10">
          <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 border-2 border-white bg-error">
            <X size={13} weight="bold" className="text-white" />
          </div>
          <p className="text-xs font-semibold uppercase tracking-wide text-error">Failed</p>
        </div>
      )}
    </div>
  );
}

export default StatusTimeline;
