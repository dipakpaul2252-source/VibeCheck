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
    yellow: 'bg-[var(--sage)] text-[var(--ink)] hover:bg-[var(--sage)]',
    coral: 'bg-[var(--terracotta)] text-[var(--ink)] hover:bg-[var(--terracotta)]',
    lilac: 'bg-[var(--output)] text-[var(--ink)] hover:bg-[var(--output)]',
    cyan: 'bg-[var(--cyan)] text-[var(--ink)] hover:bg-[var(--cyan)]',
    emerald: 'bg-[var(--sage)] text-[var(--ink)] hover:bg-[var(--sage)]',
    crimson: 'bg-[var(--rust)] text-[var(--surface)] hover:bg-[var(--rust)]',
    white: 'bg-[var(--surface)] text-[var(--ink)] hover:bg-[var(--surface)]',
    outline: 'bg-transparent text-[var(--ink)] border-2 border-[var(--ink)] hover:bg-[var(--ink)]/5',
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
          'mechanical-button inline-flex items-center justify-center gap-2 border-2 font-display tracking-tight transition-all duration-150',
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
