/**
 * Section Component - Consistent styling across all pages
 */

import React from 'react';
import { useTheme } from '../../theme/ThemeProvider';

interface SectionProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  headerIcon?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
  variant?: 'default' | 'minimal' | 'bordered';
}

const Section: React.FC<SectionProps> = ({
  children,
  title,
  subtitle,
  headerIcon,
  actions,
  className = '',
  variant = 'default'
}) => {
  const { theme } = useTheme();
  
  const getVariantClasses = () => {
    switch (variant) {
      case 'minimal':
        return 'bg-transparent border-0 shadow-none';
      case 'bordered':
        return 'border-2 border-gray-200';
      default:
        return theme.components.card.base;
    }
  };
  
  const classes = [
    getVariantClasses(),
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={classes}>
      {(title || subtitle || headerIcon || actions) && (
        <div className={theme.components.section.header}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {headerIcon && (
                <span className="text-2xl">{headerIcon}</span>
              )}
              <div>
                {title && (
                  <h2 className="text-2xl font-bold">{title}</h2>
                )}
                {subtitle && (
                  <p className="text-sm opacity-90 mt-1">{subtitle}</p>
                )}
              </div>
            </div>
            {actions && (
              <div className="flex items-center gap-2">
                {actions}
              </div>
            )}
          </div>
        </div>
      )}
      
      <div className={theme.components.section.content}>
        {children}
      </div>
    </div>
  );
};

export default Section;
