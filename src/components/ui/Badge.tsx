import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'yellow' | 'coral' | 'lilac' | 'cyan' | 'emerald' | 'crimson' | 'white';
  hasShadow?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  className,
  variant = 'yellow',
  hasShadow = false,
  ...props
}) => {
  const variantStyles = {
    yellow: 'bg-[#E2F952] text-black',
    coral: 'bg-[#FF5C00] text-white',
    lilac: 'bg-[#C084FC] text-black',
    cyan: 'bg-[#00F0FF] text-black',
    emerald: 'bg-[#10B981] text-white',
    crimson: 'bg-[#EF4444] text-white',
    white: 'bg-white text-black',
  };

  return (
    <span
      className={twMerge(
        clsx(
          'inline-flex items-center justify-center border-2 border-black px-2.5 py-0.5 text-xs font-bold uppercase font-mono tracking-tight select-none',
          variantStyles[variant],
          hasShadow && 'shadow-brutal-sm -translate-x-[1px] -translate-y-[1px]',
          className
        )
      )}
      {...props}
    >
      {children}
    </span>
  );
};
