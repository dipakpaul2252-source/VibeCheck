import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'yellow' | 'coral' | 'lilac' | 'cyan' | 'white' | 'emerald' | 'crimson' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  className,
  variant = 'yellow',
  size = 'md',
  leftIcon,
  rightIcon,
  ...props
}) => {
  const variantStyles = {
    yellow: 'bg-[#E2F952] text-black hover:bg-[#d4ec3f]',
    coral: 'bg-[#FF5C00] text-white hover:bg-[#e05200]',
    lilac: 'bg-[#C084FC] text-black hover:bg-[#b06cf5]',
    cyan: 'bg-[#00F0FF] text-black hover:bg-[#00d8e6]',
    emerald: 'bg-[#10B981] text-white hover:bg-[#0ea372]',
    crimson: 'bg-[#EF4444] text-white hover:bg-[#dc2626]',
    white: 'bg-white text-black hover:bg-neutral-100',
    outline: 'bg-transparent text-black border-2 border-black hover:bg-black/5',
  };

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs font-bold',
    md: 'px-5 py-2.5 text-sm font-black',
    lg: 'px-7 py-3.5 text-base font-black',
  };

  return (
    <button
      className={twMerge(
        clsx(
          'inline-flex items-center justify-center gap-2 border-2 border-black font-display tracking-tight transition-all duration-100',
          'shadow-brutal hover:shadow-brutal-hover hover:-translate-x-[2px] hover:-translate-y-[2px]',
          'active:shadow-none active:translate-x-[4px] active:translate-y-[4px]',
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-brutal disabled:hover:translate-x-0 disabled:hover:translate-y-0',
          variantStyles[variant],
          sizeStyles[size],
          className
        )
      )}
      {...props}
    >
      {leftIcon && <span className="inline-block">{leftIcon}</span>}
      {children}
      {rightIcon && <span className="inline-block">{rightIcon}</span>}
    </button>
  );
};
