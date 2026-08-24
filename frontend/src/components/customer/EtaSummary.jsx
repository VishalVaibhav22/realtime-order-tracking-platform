import { Clock } from "@phosphor-icons/react";

function EtaSummary({ eta }) {
  if (!eta) {
    return (
      <div className="flex flex-col items-center justify-center py-4 bg-background rounded-lg border border-border text-center">
        <Clock size={20} className="text-text-muted mb-1" />
        <span className="text-sm text-text-secondary">ETA unavailable</span>
      </div>
    );
  }

  if (eta.label) {
    return (
      <div className="flex flex-col items-center justify-center py-4 bg-accent-light rounded-lg border border-accent/20 text-center">
        <span className="text-xs font-semibold uppercase tracking-widest text-accent-hover mb-1">
          Status
        </span>
        <span className="text-2xl font-bold text-primary">{eta.label}</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-4 bg-background rounded-lg border border-border text-center">
      <span className="text-xs font-semibold uppercase tracking-widest text-text-secondary mb-1">
        Arriving In
      </span>
      <span className="text-3xl font-bold text-primary">{eta.minutes} min</span>
      <span className="text-sm text-text-secondary mt-1">{eta.distanceKm} km away</span>
    </div>
  );
}

export default EtaSummary;
