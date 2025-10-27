/**
 * Card Component - Consistent styling across all pages
 */

import React from 'react';
import { useTheme } from '../../theme/ThemeProvider';

interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'floating';
  padding?: 'sm' | 'base' | 'lg';
  className?: string;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  padding = 'base',
  className = '',
  onClick
}) => {
  const { theme } = useTheme();
  
  const baseClasses = theme.components.card.base;
  const variantClasses = theme.components.card.variants[variant];
  const paddingClasses = theme.components.card.padding[padding];
  
  const classes = [
    baseClasses,
    variantClasses,
    paddingClasses,
    onClick ? 'cursor-pointer hover:shadow-md transition-shadow duration-200' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={classes} onClick={onClick}>
      {children}
    </div>
  );
};

export default Card;
