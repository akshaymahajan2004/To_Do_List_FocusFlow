import React from 'react';
import './Header.css';

interface HeaderProps {
  completedCount: number;
  totalCount: number;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({ completedCount, totalCount, theme, toggleTheme }) => {
  // Format current date
  const formatDate = () => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    };
    return new Date().toLocaleDateString('en-US', options);
  };

  // Calculate circular progress metrics
  const radius = 22;
  const strokeWidth = 3.5;
  const circumference = 2 * Math.PI * radius;
  const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <header className="todo-header glass-panel animate-fade-in-up">
      <div className="header-info">
        <h1 className="header-title">Focus Flow</h1>
        <div className="header-date">{formatDate()}</div>
      </div>
      
      <div className="header-actions">
        <button 
          className="theme-toggle" 
          onClick={toggleTheme} 
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
          title={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
        >
          {theme === 'light' ? (
            /* Moon Icon */
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
            </svg>
          ) : (
            /* Sun Icon */
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="5"></circle>
              <line x1="12" y1="1" x2="12" y2="3"></line>
              <line x1="12" y1="21" x2="12" y2="23"></line>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
              <line x1="1" y1="12" x2="3" y2="12"></line>
              <line x1="21" y1="12" x2="23" y2="12"></line>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
            </svg>
          )}
        </button>
        
        {/* Progress Ring */}
        <div className="progress-container" title={`${completedCount} of ${totalCount} tasks completed (${percentage}%)`}>
          <svg className="progress-ring" width="50" height="50">
            <circle
              className="progress-ring-circle-bg"
              strokeWidth={strokeWidth}
              fill="transparent"
              r={radius}
              cx="25"
              cy="25"
            />
            <circle
              className="progress-ring-circle"
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              fill="transparent"
              r={radius}
              cx="25"
              cy="25"
            />
          </svg>
          <div className="progress-text">
            <span>{percentage}%</span>
          </div>
        </div>
      </div>
    </header>
  );
};
