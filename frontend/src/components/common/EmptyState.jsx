function EmptyState({ icon: Icon, title, description }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-16 text-center text-text-secondary">
      {Icon && <Icon size={32} className="text-text-muted" />}
      <p className="font-semibold text-text-primary">{title}</p>
      {description && <p className="text-sm max-w-xs">{description}</p>}
    </div>
  );
}

export default EmptyState;
