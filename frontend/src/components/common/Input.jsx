function Input({ label, error, className = "", ...props }) {
  return (
    <label className="flex flex-col gap-1.5 text-sm">
      {label && <span className="font-medium text-text-primary">{label}</span>}
      <input
        className={`border border-border rounded px-3 py-2.5 text-sm outline-none focus:border-primary transition-colors ${className}`}
        {...props}
      />
      {error && <span className="text-error text-xs">{error}</span>}
    </label>
  );
}

export default Input;
