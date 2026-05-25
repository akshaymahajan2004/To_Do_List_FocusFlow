import React, { useState, useMemo } from 'react';
import type { Todo } from '../services/api';
import { TodoItem } from './TodoItem';
import './TodoList.css';

interface TodoListProps {
  todos: Todo[];
  loading: boolean;
  onToggle: (id: string, completed: boolean) => Promise<void>;
  onUpdateTitle: (id: string, title: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

type FilterType = 'all' | 'active' | 'completed';
type SortType = 'newest' | 'oldest' | 'alphabetical';

export const TodoList: React.FC<TodoListProps> = ({ 
  todos, 
  loading, 
  onToggle, 
  onUpdateTitle, 
  onDelete 
}) => {
  const [filter, setFilter] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortType>('newest');

  // Filter and sort items efficiently with useMemo
  const processedTodos = useMemo(() => {
    let result = [...todos];

    // 1. Apply Search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(todo => todo.title.toLowerCase().includes(query));
    }

    // 2. Apply Filters
    if (filter === 'active') {
      result = result.filter(todo => !todo.completed);
    } else if (filter === 'completed') {
      result = result.filter(todo => todo.completed);
    }

    // 3. Apply Sorting
    result.sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else if (sortBy === 'oldest') {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      } else if (sortBy === 'alphabetical') {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });

    return result;
  }, [todos, searchQuery, filter, sortBy]);

  // Render skeletons for premium loading experience
  if (loading && todos.length === 0) {
    return (
      <div className="todo-list-container glass-panel list-controls">
        <div className="skeleton-task-card skeleton" />
        <div className="skeleton-task-card skeleton" />
        <div className="skeleton-task-card skeleton" />
      </div>
    );
  }

  return (
    <div className="todo-list-container glass-panel animate-fade-in-up">
      {/* Search and Filters panel */}
      <div className="list-controls">
        <div className="search-bar-wrapper">
          <svg className="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input
            type="text"
            className="search-input"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="filter-sort-row">
          {/* Tabs Filter */}
          <div className="filter-tabs">
            <button 
              className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All
            </button>
            <button 
              className={`filter-tab ${filter === 'active' ? 'active' : ''}`}
              onClick={() => setFilter('active')}
            >
              Active
            </button>
            <button 
              className={`filter-tab ${filter === 'completed' ? 'active' : ''}`}
              onClick={() => setFilter('completed')}
            >
              Completed
            </button>
          </div>

          {/* Sort Selector */}
          <div className="sort-wrapper">
            <span className="sort-label">Sort:</span>
            <select 
              className="sort-select" 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value as SortType)}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="alphabetical">Alphabetical</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main list or empty states */}
      {processedTodos.length > 0 ? (
        <div className="tasks-items-list">
          {processedTodos.map((todo) => (
            <TodoItem
              key={todo._id}
              todo={todo}
              onToggle={onToggle}
              onUpdateTitle={onUpdateTitle}
              onDelete={onDelete}
            />
          ))}
        </div>
      ) : (
        /* Aesthetic Empty State */
        <div className="empty-state">
          <img 
            src="/empty_state.png" 
            alt="No tasks found" 
            className="empty-state-img"
          />
          <h3 className="empty-state-title">
            {searchQuery ? 'No results found' : 'All clear!'}
          </h3>
          <p className="empty-state-desc">
            {searchQuery 
              ? 'Try adjusting your search terms or filters.'
              : 'You have no items on your list. Enjoy your day or add some fresh goals above!'}
          </p>
        </div>
      )}
    </div>
  );
};
