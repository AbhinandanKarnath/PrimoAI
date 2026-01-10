import axios from 'axios'

// Use /api for proxy in development, or full URL from env variable
const API_URL = import.meta.env.VITE_API_URL || '/api'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Log the error for debugging
    console.error('API Error:', {
      status: error.response?.status,
      message: error.response?.data?.message,
      errors: error.response?.data?.errors,
      url: error.config?.url
    })
    
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      // But don't redirect if we're already on the login page
      if (!window.location.pathname.includes('/login')) {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export default api
