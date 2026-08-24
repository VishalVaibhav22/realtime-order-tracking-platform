import { WarningCircle } from "@phosphor-icons/react";
import Button from "./Button";

function ErrorState({ message = "Something went wrong", onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
      <WarningCircle size={32} className="text-error" />
      <p className="text-sm text-text-secondary max-w-xs">{message}</p>
      {onRetry && (
        <Button variant="secondary" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
}

export default ErrorState;
