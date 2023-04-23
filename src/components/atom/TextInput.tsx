import clsx from 'clsx';
import React from 'react';

export interface ITextInput
  extends React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {
  className?: string;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  onIconLeftClick?: () => void;
  onIconRightClick?: () => void;
}

function TextInputWithRef(
  { className, ...props }: ITextInput,
  ref: React.ForwardedRef<HTMLInputElement>,
) {
  return (
    <div className={clsx('relative flex items-center gap-2', className)}>
      <input
        {...props}
        className={clsx(
          'w-full rounded-full border-none bg-slate-100 px-4 py-2',
          { 'pl-8': props.iconLeft },
          { 'pr-8': props.iconRight },
          'text-sm text-neutral-900',
          className,
        )}
        ref={ref}
      />
      {props.iconLeft && (
        <div
          className="absolute left-3"
          onClick={props.onIconLeftClick}
          role={props.onIconLeftClick ? 'button' : undefined}
          tabIndex={0}
        >
          {props.iconLeft}
        </div>
      )}
      {props.iconRight && (
        <div
          className="absolute right-3"
          onClick={props.onIconRightClick}
          role={props.onIconRightClick ? 'button' : undefined}
          tabIndex={0}
        >
          {props.iconRight}
        </div>
      )}
    </div>
  );
}

export const TextInput = React.forwardRef(TextInputWithRef);
