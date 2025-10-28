/**
 * Page Layout Component - Consistent layout across all pages
 */

import React from 'react';
import { useTheme } from '../../theme/ThemeProvider';
import Button from '../ui/Button';

interface PageLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  headerActions?: React.ReactNode;
  breadcrumbs?: Array<{ label: string; href?: string }>;
  className?: string;
  hideHeader?: boolean;
}

const PageLayout: React.FC<PageLayoutProps> = ({
  children,
  title,
  subtitle,
  headerActions,
  breadcrumbs,
  className = '',
  hideHeader = false
}) => {
  const { theme, isDark, toggleTheme } = useTheme();

  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 ${className}`}>
      {/* Header */}
      {!hideHeader && (title || headerActions || (breadcrumbs && breadcrumbs.length > 0)) && (
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
          <div className={theme.layout.container.base}>
            <div className="py-6">
              {/* Breadcrumbs */}
              {breadcrumbs && breadcrumbs.length > 0 && (
                <nav className="mb-4">
                  <ol className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                    {breadcrumbs.map((crumb, index) => (
                      <li key={index} className="flex items-center">
                        {index > 0 && (
                          <svg className="w-4 h-4 mx-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                        {crumb.href ? (
                          <a href={crumb.href} className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                            {crumb.label}
                          </a>
                        ) : (
                          <span className={index === breadcrumbs.length - 1 ? 'text-gray-900 dark:text-white font-medium' : ''}>
                            {crumb.label}
                          </span>
                        )}
                      </li>
                    ))}
                  </ol>
                </nav>
              )}

              {/* Title and Actions */}
              <div className="flex items-center justify-between">
                <div>
                  {title && (
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{title}</h1>
                  )}
                  {subtitle && (
                    <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">{subtitle}</p>
                  )}
                </div>
                
                <div className="flex items-center gap-4">
                  {headerActions}
                </div>
              </div>
            </div>
          </div>
        </header>
      )}

      {/* Main Content */}
      <main className={theme.layout.container.base}>
        <div className={!hideHeader && (title || headerActions || (breadcrumbs && breadcrumbs.length > 0)) ? "py-8" : "py-4"}>
          {children}
        </div>
      </main>

      {/* Floating Theme Toggle */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={toggleTheme}
          className="shadow-lg bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          <span className="text-lg mr-2">{isDark ? '☀️' : '🌙'}</span>
          {isDark ? 'Light' : 'Dark'}
        </Button>
      </div>
    </div>
  );
};

export default PageLayout;
