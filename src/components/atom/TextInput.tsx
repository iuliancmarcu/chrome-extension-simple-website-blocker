import React from 'react';

import { cn } from '../../utils/cn';

export interface ITextInput
  extends React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {
  className?: string;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
}

function TextInputWithRef(
  { className, iconLeft, iconRight, ...props }: ITextInput,
  ref: React.ForwardedRef<HTMLInputElement>,
) {
  return (
    <div className={cn('relative flex items-center gap-2', className)}>
      <input
        {...props}
        className={cn(
          'w-full rounded-full border-none bg-slate-100 px-4 py-2',
          { 'pl-8': iconLeft },
          { 'pr-8': iconRight },
          'text-sm text-neutral-900',
          className,
        )}
        ref={ref}
      />
      {iconLeft && (
        <div className="absolute left-3" tabIndex={0}>
          {iconLeft}
        </div>
      )}
      {iconRight && (
        <div className="absolute right-3" tabIndex={0}>
          {iconRight}
        </div>
      )}
    </div>
  );
}

export const TextInput = React.forwardRef(TextInputWithRef);
