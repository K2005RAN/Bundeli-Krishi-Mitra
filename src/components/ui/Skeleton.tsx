import React from 'react';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'rect' | 'circle';
}

export const Skeleton: React.FC<SkeletonProps> = ({
  variant = 'rect',
  className = '',
  ...props
}) => {
  const baseStyle = 'animate-pulse bg-slate-200 dark:bg-slate-800';
  
  const shapes = {
    text: 'h-4 w-full rounded',
    rect: 'h-24 w-full rounded-xl',
    circle: 'h-12 w-12 rounded-full',
  };

  return (
    <div
      className={`${baseStyle} ${shapes[variant]} ${className}`}
      {...props}
    />
  );
};
