import React, { useState, type FormEvent } from 'react';
import './TodoForm.css';

interface TodoFormProps {
  onAdd: (title: string) => Promise<void>;
}

export const TodoForm: React.FC<TodoFormProps> = ({ onAdd }) => {
  const [title, setTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const cleanTitle = title.trim();
    if (!cleanTitle || isSubmitting) return;

    try {
      setIsSubmitting(true);
      await onAdd(cleanTitle);
      setTitle(''); // Clear input
    } catch (error) {
      console.error('Failed to add todo:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="todo-form animate-fade-in-up" onSubmit={handleSubmit}>
      <div className="input-wrapper">
        <input
          type="text"
          className="todo-input"
          placeholder="Add a new task..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={isSubmitting}
          maxLength={100}
          required
        />
        <span className="shortcut-hint">Enter</span>
      </div>
      <button 
        type="submit" 
        className="todo-submit" 
        disabled={isSubmitting || !title.trim()}
        title="Add task"
      >
        {isSubmitting ? (
          <div className="submit-spinner" />
        ) : (
          <>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            <span>Add Task</span>
          </>
        )}
      </button>
    </form>
  );
};
