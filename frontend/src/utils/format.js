export const ORDER_STATUSES = [
  "PLACED",
  "ACCEPTED",
  "PICKED_UP",
  "IN_TRANSIT",
  "DELIVERED",
  "FAILED",
];

export const STATUS_LABELS = {
  PLACED: "Placed",
  ACCEPTED: "Accepted",
  PICKED_UP: "Picked Up",
  IN_TRANSIT: "In Transit",
  DELIVERED: "Delivered",
  FAILED: "Failed",
};

// which status a driver's next action would move an order to
export const NEXT_STATUS = {
  ACCEPTED: "PICKED_UP",
  PICKED_UP: "IN_TRANSIT",
};

export const ACTION_LABELS = {
  PICKED_UP: "Mark Picked Up",
  IN_TRANSIT: "Start Delivery",
};

export function formatDateTime(isoString) {
  if (!isoString) return "--";
  return new Date(isoString).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function formatTime(isoString) {
  if (!isoString) return "--";
  return new Date(isoString).toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
  });
}
