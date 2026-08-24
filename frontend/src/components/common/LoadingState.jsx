import { CircleNotch } from "@phosphor-icons/react";

function LoadingState({ label = "Loading" }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-text-secondary">
      <CircleNotch size={28} className="animate-spin" />
      <span className="text-sm">{label}</span>
    </div>
  );
}

export default LoadingState;
