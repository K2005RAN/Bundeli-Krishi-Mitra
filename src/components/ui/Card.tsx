import React from 'react';
import { motion } from 'framer-motion';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverLift?: boolean;
  glass?: boolean;
  animate?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hoverLift = false,
  glass = false,
  animate = false,
  ...props
}) => {
  const baseClasses = `rounded-xl p-6 ${
    glass
      ? 'glass-card'
      : 'bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md'
  } transition-all duration-300 ${hoverLift ? 'hover-lift' : ''}`;

  if (animate) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={`${baseClasses} ${className}`}
        {...(props as any)}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div className={`${baseClasses} ${className}`} {...props}>
      {children}
    </div>
  );
};

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className = '',
  ...props
}) => (
  <div className={`flex flex-col space-y-1.5 pb-4 ${className}`} {...props}>
    {children}
  </div>
);

export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({
  children,
  className = '',
  ...props
}) => (
  <h3
    className={`text-xl font-semibold leading-none tracking-tight text-slate-800 dark:text-slate-100 ${className}`}
    {...props}
  >
    {children}
  </h3>
);

export const CardDescription: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({
  children,
  className = '',
  ...props
}) => (
  <p
    className={`text-sm text-slate-500 dark:text-slate-400 ${className}`}
    {...props}
  >
    {children}
  </p>
);

export const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className = '',
  ...props
}) => <div className={`${className}`} {...props}>{children}</div>;
