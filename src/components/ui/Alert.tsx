import React from 'react';
import { AlertCircle, CheckCircle2, Info, AlertTriangle } from 'lucide-react';

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'info' | 'success' | 'warning' | 'danger';
  title?: string;
}

export const Alert: React.FC<AlertProps> = ({
  children,
  variant = 'info',
  title,
  className = '',
  ...props
}) => {
  const styles = {
    info: 'bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-300',
    success: 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-300',
    warning: 'bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300',
    danger: 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-300',
  };

  const icons = {
    info: <Info className="h-5 w-5 flex-shrink-0" />,
    success: <CheckCircle2 className="h-5 w-5 flex-shrink-0" />,
    warning: <AlertTriangle className="h-5 w-5 flex-shrink-0" />,
    danger: <AlertCircle className="h-5 w-5 flex-shrink-0" />,
  };

  return (
    <div
      role="alert"
      className={`flex gap-3 border rounded-xl p-4 text-sm ${styles[variant]} ${className}`}
      {...props}
    >
      <span className="mt-0.5">{icons[variant]}</span>
      <div className="flex-1">
        {title && <h5 className="font-semibold mb-1 leading-none">{title}</h5>}
        <div className="leading-relaxed">{children}</div>
      </div>
    </div>
  );
};
