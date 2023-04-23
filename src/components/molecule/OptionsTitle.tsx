interface IOptionsTitle {
  className?: string;
  title: string;
  description: React.ReactNode;
}

export function OptionsTitle({ className, title, description }: IOptionsTitle) {
  return (
    <div className={className}>
      <div className="mb-1">
        <h1 className="text-lg font-bold uppercase tracking-tighter text-neutral-900">
          {title}
        </h1>
        <p className="text-xs text-neutral-500">{description}</p>
      </div>
    </div>
  );
}
