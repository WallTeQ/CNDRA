import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'sm' | 'md' | 'lg' | 'none';
  hover?: boolean;
  variant?: 'default' | 'elevated' | 'outlined' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  padding = 'md',
  hover = false,
  variant = 'default',
  size = 'md'
}) => {
  const paddingClasses = {
    none: 'p-0',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };

  const variantClasses = {
    default: 'bg-card text-card-foreground border border-border shadow-sm',
    elevated: 'bg-card text-card-foreground border-0 shadow-lg',
    outlined: 'bg-background text-foreground border-2 border-border shadow-none',
    ghost: 'bg-transparent text-foreground border-0 shadow-none'
  };

  const sizeClasses = {
    sm: 'rounded-md',
    md: 'rounded-lg',
    lg: 'rounded-xl'
  };

  const hoverClasses = hover
    ? 'hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 ease-out'
    : '';

  return (
    <div className={`
      ${variantClasses[variant]}
      ${paddingClasses[padding]}
      ${sizeClasses[size]}
      ${hoverClasses}
      ${className}
    `}>
      {children}
    </div>
  );
};

export const CardHeader: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`flex flex-col space-y-1.5 pb-4 ${className}`}>
    {children}
  </div>
);

export const CardTitle: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <h3 className={`text-xl font-semibold leading-none tracking-tight text-foreground ${className}`}>
    {children}
  </h3>
);

export const CardDescription: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <p className={`text-sm text-muted-foreground ${className}`}>
    {children}
  </p>
);

export const CardContent: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`text-foreground ${className}`}>
    {children}
  </div>
);

export const CardFooter: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`flex items-center pt-4 ${className}`}>
    {children}
  </div>
);