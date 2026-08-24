const VARIANTS = {
  primary: "bg-primary text-white hover:bg-primary/90",
  secondary: "bg-surface text-primary border border-primary hover:bg-background",
  accent: "bg-accent text-white hover:bg-accent-hover",
  danger: "bg-surface text-error border border-error hover:bg-error/5",
};

function Button({ variant = "primary", className = "", children, ...props }) {
  return (
    <button
      className={`px-4 py-2.5 rounded text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${VARIANTS[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
