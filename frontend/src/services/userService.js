import api from './api'

const userService = {
  // Get user profile
  getProfile: async () => {
    const response = await api.get('/users/profile')
    return response.data
  },

  // Update user profile
  updateProfile: async (userData) => {
    const response = await api.put('/users/profile', userData)
    if (response.data.success) {
      // Update local storage
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}')
      const updatedUser = { ...currentUser, ...response.data.data }
      localStorage.setItem('user', JSON.stringify(updatedUser))
    }
    return response.data
  },

  // Update password
  updatePassword: async (passwordData) => {
    const response = await api.put('/users/password', passwordData)
    return response.data
  },
}

export default userService
