import { useState, useEffect } from 'react';
import { api, type Todo } from './services/api';
import { Header } from './components/Header';
import { TodoForm } from './components/TodoForm';
import { TodoList } from './components/TodoList';
import { ToastContainer, type ToastMessage } from './components/Toast';
import './App.css';

export default function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  
  // Theme state: defaults to dark mode for that premium feel
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light' || savedTheme === 'dark') {
      return savedTheme;
    }
    return 'dark';
  });

  // Apply and persist theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Load todos from MongoDB on component mount
  useEffect(() => {
    const fetchTodos = async () => {
      try {
        setLoading(true);
        const data = await api.getTodos();
        setTodos(data);
      } catch (err: any) {
        showToast(err.message || 'Failed to fetch tasks from server.', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchTodos();
  }, []);

  // Show dynamic toast alerts
  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    const newToast: ToastMessage = {
      id: Date.now().toString() + Math.random().toString(36).substring(2, 5),
      type,
      message,
    };
    setToasts((prev) => [...prev, newToast]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Toggle Theme helper
  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
    showToast(
      `Switched to ${theme === 'light' ? 'Dark' : 'Light'} Mode`, 
      'info'
    );
  };

  // CRUD Event Handlers
  const handleAddTodo = async (title: string) => {
    try {
      const newTodo = await api.createTodo(title);
      setTodos((prev) => [newTodo, ...prev]);
      showToast('Task added successfully!', 'success');
    } catch (err: any) {
      showToast(err.message || 'Could not save task.', 'error');
      throw err; // Re-throw to inform Form submitting spinner
    }
  };

  const handleToggleTodo = async (id: string, completed: boolean) => {
    // Optimistic UI updates
    const oldTodos = [...todos];
    setTodos((prev) =>
      prev.map((t) => (t._id === id ? { ...t, completed } : t))
    );

    try {
      await api.updateTodo(id, { completed });
      showToast(
        completed ? 'Task completed! Keep flowing.' : 'Task active again.',
        'info'
      );
    } catch (err: any) {
      // Revert optimistic updates
      setTodos(oldTodos);
      showToast(err.message || 'Could not update task status.', 'error');
    }
  };

  const handleUpdateTodoTitle = async (id: string, title: string) => {
    // Optimistic UI updates
    const oldTodos = [...todos];
    setTodos((prev) =>
      prev.map((t) => (t._id === id ? { ...t, title } : t))
    );

    try {
      await api.updateTodo(id, { title });
      showToast('Task updated successfully!', 'success');
    } catch (err: any) {
      // Revert optimistic updates
      setTodos(oldTodos);
      showToast(err.message || 'Could not rename task.', 'error');
    }
  };

  const handleDeleteTodo = async (id: string) => {
    // Optimistic UI updates
    const oldTodos = [...todos];
    setTodos((prev) => prev.filter((t) => t._id !== id));

    try {
      await api.deleteTodo(id);
      showToast('Task deleted from server.', 'info');
    } catch (err: any) {
      // Revert optimistic updates
      setTodos(oldTodos);
      showToast(err.message || 'Could not delete task.', 'error');
    }
  };

  const completedCount = todos.filter((t) => t.completed).length;

  return (
    <div className="app-container">
      {/* Dynamic Glowing mesh blobs */}
      <div className="bg-glow-1" />
      <div className="bg-glow-2" />

      {/* Floating Actions Alerts */}
      <ToastContainer toasts={toasts} onClose={removeToast} />

      {/* Premium Header Panel */}
      <Header
        completedCount={completedCount}
        totalCount={todos.length}
        theme={theme}
        toggleTheme={toggleTheme}
      />

      {/* New Task Creator */}
      <TodoForm onAdd={handleAddTodo} />

      {/* Interactive Todo List */}
      <TodoList
        todos={todos}
        loading={loading}
        onToggle={handleToggleTodo}
        onUpdateTitle={handleUpdateTodoTitle}
        onDelete={handleDeleteTodo}
      />

      {/* Premium footer credits */}
      <footer className="app-footer">
        <span>Crafted with</span>
        <span className="footer-heart">♥</span>
        <span>for Focus Flow</span>
      </footer>
    </div>
  );
}
