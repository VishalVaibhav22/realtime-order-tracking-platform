import { STATUS_LABELS } from "../../utils/format";

const STATUS_STYLES = {
  PLACED: "bg-background text-text-secondary border border-border",
  ACCEPTED: "bg-accent-light text-accent-hover",
  PICKED_UP: "bg-accent-light text-accent-hover",
  IN_TRANSIT: "bg-accent-light text-accent",
  DELIVERED: "bg-success/10 text-success",
  FAILED: "bg-error/10 text-error",
};

function Badge({ status }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide uppercase ${STATUS_STYLES[status] || ""}`}
    >
      {STATUS_LABELS[status] || status}
    </span>
  );
}

export default Badge;
