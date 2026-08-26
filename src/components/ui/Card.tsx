import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'yellow' | 'coral' | 'lilac' | 'cyan' | 'white' | 'emerald' | 'canvas';
  shadowSize?: 'sm' | 'md' | 'lg' | 'none';
  interactive?: boolean;
  headerText?: string;
  headerBg?: 'yellow' | 'coral' | 'lilac' | 'cyan' | 'white' | 'emerald';
  headerActions?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  variant = 'white',
  shadowSize = 'md',
  interactive = false,
  headerText,
  headerBg = 'yellow',
  headerActions,
  ...props
}) => {
  const bgStyles = {
    yellow: 'bg-[#E2F952] text-black',
    coral: 'bg-[#FF5C00] text-white',
    lilac: 'bg-[#C084FC] text-black',
    cyan: 'bg-[#00F0FF] text-black',
    emerald: 'bg-[#10B981] text-white',
    white: 'bg-white text-black',
    canvas: 'bg-[#F4F0EA] text-black',
  };

  const shadowStyles = {
    none: 'shadow-none',
    sm: 'shadow-brutal-sm',
    md: 'shadow-brutal',
    lg: 'shadow-brutal-lg',
  };

  const headerBgStyles = {
    yellow: 'bg-[#E2F952] text-black',
    coral: 'bg-[#FF5C00] text-white',
    lilac: 'bg-[#C084FC] text-black',
    cyan: 'bg-[#00F0FF] text-black',
    emerald: 'bg-[#10B981] text-white',
    white: 'bg-white text-black border-b-2',
  };

  return (
    <div
      className={twMerge(
        clsx(
          'border-3 border-black overflow-hidden font-display transition-all duration-100 flex flex-col',
          bgStyles[variant],
          shadowStyles[shadowSize],
          interactive && 'hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-brutal-hover cursor-pointer active:translate-x-[2px] active:translate-y-[2px] active:shadow-brutal-sm',
          className
        )
      )}
      {...props}
    >
      {headerText && (
        <div
          className={twMerge(
            clsx(
              'flex items-center justify-between border-b-3 border-black px-4 py-2 text-sm font-black uppercase tracking-tight',
              headerBgStyles[headerBg]
            )
          )}
        >
          <span>{headerText}</span>
          {headerActions && <div>{headerActions}</div>}
        </div>
      )}
      <div className="flex-1 p-4 sm:p-5 flex flex-col">
        {children}
      </div>
    </div>
  );
};
