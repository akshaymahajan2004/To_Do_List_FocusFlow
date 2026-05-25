export interface Todo {
  _id: string;
  title: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

const BASE_URL = '/api/todos';

/**
 * Handle API responses and standardize errors
 */
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let errorMessage = `Request failed with status ${response.status}`;
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorMessage;
    } catch {
      // Ignore if body is not JSON
    }
    throw new Error(errorMessage);
  }
  return response.json() as Promise<T>;
}

/**
 * API service calls for managing Todo items
 */
export const api = {
  /**
   * Fetch all Todo items from the server
   */
  async getTodos(): Promise<Todo[]> {
    const response = await fetch(BASE_URL);
    return handleResponse<Todo[]>(response);
  },

  /**
   * Create a new Todo item
   */
  async createTodo(title: string): Promise<Todo> {
    const response = await fetch(BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title }),
    });
    return handleResponse<Todo>(response);
  },

  /**
   * Update a Todo item's fields (title, completed status, etc.)
   */
  async updateTodo(id: string, updates: Partial<Pick<Todo, 'title' | 'completed'>>): Promise<Todo> {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });
    return handleResponse<Todo>(response);
  },

  /**
   * Delete a Todo item by ID
   */
  async deleteTodo(id: string): Promise<void> {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      let errorMessage = `Delete request failed with status ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch {
        // Fallback for text response
      }
      throw new Error(errorMessage);
    }
  }
};
