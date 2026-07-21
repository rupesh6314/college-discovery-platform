import api from './api'

export const authService = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password })
    if (response.data.token) {
      localStorage.setItem('token', response.data.token)
      if (response.data.refreshToken) {
        localStorage.setItem('refreshToken', response.data.refreshToken)
      }
    }
    return response.data
  },
  
  register: async (name, email, password) => {
    const response = await api.post('/auth/register', { name, email, password })
    if (response.data.token) {
      localStorage.setItem('token', response.data.token)
    }
    return response.data
  },
  
  getMe: async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      throw new Error('No token found')
    }
    const response = await api.get('/auth/me')
    return response.data
  },
  
  logout: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('refreshToken')
  },
  
  forgotPassword: async (email) => {
    const response = await api.post('/auth/forgot-password', { email })
    return response.data
  },
  
  verifyResetCode: async (email, code) => {
    const response = await api.post('/auth/verify-code', { email, code })
    return response.data
  },
  
  resetPassword: async (token, newPassword) => {
    const response = await api.post('/auth/reset-password', { token, newPassword })
    return response.data
  },

  updateProfile: async (data) => {
    const response = await api.put('/auth/profile', data)
    return response.data
  },

  requestEmailChange: async (newEmail) => {
    const response = await api.post('/auth/request-email-change', { newEmail })
    return response.data
  },

  verifyEmailChange: async (code) => {
    const response = await api.post('/auth/verify-email-change', { code })
    return response.data
  }
}