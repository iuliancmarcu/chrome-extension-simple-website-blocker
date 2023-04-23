import clsx from 'clsx';

interface IButton
  extends React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  children: React.ReactNode;
  className?: string;
}

export function Button({
  children,
  className,
  type = 'button',
  ...props
}: IButton) {
  return (
    <button
      {...props}
      className={clsx(
        'rounded-full border-none bg-slate-600 px-6 py-2',
        'text-sm text-neutral-50',
        className,
      )}
      type={type}
    >
      {children}
    </button>
  );
}
