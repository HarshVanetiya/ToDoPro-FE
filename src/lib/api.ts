const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api/v1'

interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  errors?: Array<{ field: string; message: string; value: any }>
}

class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: any,
    public errors?: Array<{ field: string; message: string; value: any }>
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

async function request<T = any>(
  path: string,
  options: {
    method?: string
    body?: any
    headers?: Record<string, string>
  } = {}
): Promise<ApiResponse<T>> {
  const { method = 'GET', body, headers = {} } = options

  // Debug logging for API requests
  console.log('🌐 [API] Making request:', {
    method,
    path: `${API_BASE}${path}`,
    body: body ? JSON.stringify(body, null, 2) : 'No body',
    headers,
    credentials: 'include',
    timestamp: new Date().toISOString()
  })

  const config: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    credentials: 'include', // Include httpOnly cookies
  }

  if (body) {
    config.body = JSON.stringify(body)
  }

  try {
    const response = await fetch(`${API_BASE}${path}`, config)
    
    console.log('🌐 [API] Response status:', response.status, response.statusText)
    console.log('🌐 [API] Response headers:', Object.fromEntries(response.headers.entries()))
    
    const contentType = response.headers.get('content-type') || ''
    const data = contentType.includes('application/json') 
      ? await response.json() 
      : await response.text()

    console.log('🌐 [API] Response data:', data)

    if (!response.ok) {
      const message = data?.message || response.statusText || 'Request failed'
      const errors = data?.errors
      console.error('❌ [API] Request failed:', {
        status: response.status,
        message,
        errors,
        data
      })
      throw new ApiError(message, response.status, data, errors)
    }

    console.log('✅ [API] Request successful')
    return data
  } catch (error) {
    console.error('❌ [API] Request error:', error)
    throw error
  }
}

export const api = {
  get: <T = any>(path: string) => request<T>(path, { method: 'GET' }),
  post: <T = any>(path: string, body?: any) => request<T>(path, { method: 'POST', body }),
  put: <T = any>(path: string, body?: any) => request<T>(path, { method: 'PUT', body }),
  patch: <T = any>(path: string, body?: any) => request<T>(path, { method: 'PATCH', body }),
  delete: <T = any>(path: string) => request<T>(path, { method: 'DELETE' }),
}

// Auth API
export const authApi = {
  register: (payload: { name: string; email: string; password: string }) =>
    api.post('/auth/register', payload),
  login: (payload: { email: string; password: string }) =>
    api.post('/auth/login', payload),
  logout: () => api.post('/auth/logout'),
  me: () => api.get('/auth/me'),
  forgotPassword: (payload: { email: string }) =>
    api.post('/auth/forgot-password', payload),
  resetPassword: (payload: { token: string; password: string }) =>
    api.put('/auth/reset-password', payload),
  updatePassword: (payload: { currentPassword: string; newPassword: string }) =>
    api.put('/auth/update-password', payload),
  updateProfile: (payload: { name?: string; email?: string }) =>
    api.put('/auth/profile', payload),
}

// Todos API
export const todosApi = {
  list: (params: {
    status?: 'pending' | 'done'
    priority?: 'low' | 'medium' | 'high'
    search?: string
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
    page?: number
    limit?: number
  } = {}) => {
    const query = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        query.append(key, String(value))
      }
    })
    const path = `/todos${query.toString() ? `?${query.toString()}` : ''}`
    return api.get(path)
  },
  get: (id: string) => api.get(`/todos/${id}`),
  create: (payload: {
    title: string
    description?: string
    priority?: 'low' | 'medium' | 'high'
    dueDate?: string
  }) => api.post('/todos', payload),
  update: (id: string, payload: {
    title?: string
    description?: string
    status?: 'pending' | 'done'
    priority?: 'low' | 'medium' | 'high'
    dueDate?: string
  }) => api.put(`/todos/${id}`, payload),
  remove: (id: string) => api.delete(`/todos/${id}`),
  toggle: (id: string) => api.patch(`/todos/${id}/toggle`),
  stats: () => api.get('/todos/stats'),
}

export { ApiError }
