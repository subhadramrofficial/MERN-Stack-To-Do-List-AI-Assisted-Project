const BASE_URL = import.meta.env.VITE_API_URL || '/api/todos';

/**
 * Helper to handle fetch responses and throw informative errors
 */
const handleResponse = async (response) => {
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const errorMsg = data?.message || `Request failed with status ${response.status}`;
    throw new Error(errorMsg);
  }

  return data;
};

export const todoApi = {
  // Get all todos with optional query params
  async getAll({ status, priority, search, sortBy } = {}) {
    const params = new URLSearchParams();
    if (status && status !== 'all') params.append('status', status);
    if (priority && priority !== 'all') params.append('priority', priority);
    if (search) params.append('search', search);
    if (sortBy) params.append('sortBy', sortBy);

    const queryString = params.toString() ? `?${params.toString()}` : '';
    const res = await fetch(`${BASE_URL}${queryString}`);
    const result = await handleResponse(res);
    return result.data || [];
  },

  // Get a single todo by ID
  async getById(id) {
    const res = await fetch(`${BASE_URL}/${id}`);
    const result = await handleResponse(res);
    return result.data;
  },

  // Create a new todo
  async create(todoData) {
    const res = await fetch(BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(todoData)
    });
    const result = await handleResponse(res);
    return result.data;
  },

  // Update an existing todo
  async update(id, updateData) {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updateData)
    });
    const result = await handleResponse(res);
    return result.data;
  },

  // Delete a todo
  async delete(id) {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: 'DELETE'
    });
    return await handleResponse(res);
  },

  // Clear all completed todos
  async clearCompleted() {
    const res = await fetch(`${BASE_URL}/completed`, {
      method: 'DELETE'
    });
    return await handleResponse(res);
  }
};
