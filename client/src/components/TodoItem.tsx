import React, { useState, useRef, useEffect } from 'react';
import type { Todo } from '../services/api';
import './TodoItem.css';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string, completed: boolean) => Promise<void>;
  onUpdateTitle: (id: string, title: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export const TodoItem: React.FC<TodoItemProps> = ({ todo, onToggle, onUpdateTitle, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [isToggling, setIsToggling] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const editInputRef = useRef<HTMLInputElement>(null);

  // Focus the edit input when entering edit mode
  useEffect(() => {
    if (isEditing && editInputRef.current) {
      editInputRef.current.focus();
      editInputRef.current.select();
    }
  }, [isEditing]);

  // If backend updates title while we aren't editing, update state
  useEffect(() => {
    if (!isEditing) {
      setEditTitle(todo.title);
    }
  }, [todo.title, isEditing]);

  const handleToggle = async () => {
    if (isToggling) return;
    try {
      setIsToggling(true);
      await onToggle(todo._id, !todo.completed);
    } catch (err) {
      console.error(err);
    } finally {
      setIsToggling(false);
    }
  };

  const handleSave = async () => {
    const cleanTitle = editTitle.trim();
    if (!cleanTitle) {
      setEditTitle(todo.title);
      setIsEditing(false);
      return;
    }

    if (cleanTitle === todo.title) {
      setIsEditing(false);
      return;
    }

    try {
      await onUpdateTitle(todo._id, cleanTitle);
      setIsEditing(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      setEditTitle(todo.title);
      setIsEditing(false);
    }
  };

  const handleDelete = async () => {
    if (isDeleting) return;
    try {
      setIsDeleting(true);
      // Wait for exit animation to complete (300ms) before calling deletion callback
      setTimeout(async () => {
        try {
          await onDelete(todo._id);
        } catch (err) {
          setIsDeleting(false);
          console.error(err);
        }
      }, 300);
    } catch (err) {
      setIsDeleting(false);
      console.error(err);
    }
  };

  // Format created date/time nicely
  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    const today = new Date();
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    }
    
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  return (
    <div className={`todo-item-card ${todo.completed ? 'completed' : ''} ${isDeleting ? 'exit' : ''}`}>
      {/* Checkbox */}
      <div className="checkbox-wrapper" onClick={handleToggle}>
        <div className={`checkbox-custom ${todo.completed ? 'checked' : ''}`}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="todo-content-area">
        {isEditing ? (
          <input
            ref={editInputRef}
            type="text"
            className="todo-edit-input"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
            maxLength={100}
          />
        ) : (
          <span 
            className="todo-item-title" 
            onDoubleClick={() => setIsEditing(true)}
            title="Double-click to edit"
          >
            {todo.title}
          </span>
        )}
        
        {/* Meta details */}
        <div className="todo-meta">
          <span>{formatDate(todo.createdAt)}</span>
          <span className="todo-meta-dot" />
          <span>{formatTime(todo.createdAt)}</span>
          {todo.updatedAt !== todo.createdAt && (
            <>
              <span className="todo-meta-dot" />
              <span>edited</span>
            </>
          )}
        </div>
      </div>

      {/* Hover actions */}
      <div className="todo-item-actions">
        {!isEditing && (
          <button 
            className="action-btn edit-btn" 
            onClick={() => setIsEditing(true)}
            title="Edit task"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 20h9"></path>
              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
            </svg>
          </button>
        )}
        
        <button 
          className="action-btn delete-btn" 
          onClick={handleDelete}
          title="Delete task"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            <line x1="10" y1="11" x2="10" y2="17"></line>
            <line x1="14" y1="11" x2="14" y2="17"></line>
          </svg>
        </button>
      </div>
    </div>
  );
};
