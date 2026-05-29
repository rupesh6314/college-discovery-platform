import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export const login = createAsyncThunk('auth/login', async ({ email, password }, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, { email, password })
    localStorage.setItem('token', response.data.token)
    return response.data
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || 'Login failed')
  }
})

export const register = createAsyncThunk('auth/register', async ({ name, email, password }, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${API_URL}/auth/register`, { name, email, password })
    localStorage.setItem('token', response.data.token)
    return response.data
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || 'Registration failed')
  }
})

export const getMe = createAsyncThunk('auth/getMe', async (_, { getState, rejectWithValue }) => {
  try {
    const token = getState().auth.token || localStorage.getItem('token')
    const response = await axios.get(`${API_URL}/auth/me`, { headers: { Authorization: `Bearer ${token}` } })
    return response.data
  } catch (error) {
    return rejectWithValue(error.response?.data?.error)
  }
})

const authSlice = createSlice({
  name: 'auth',
  initialState: { user: null, token: localStorage.getItem('token'), isAuthenticated: false, loading: true, error: null },
  reducers: {
    logout: (state) => {
      localStorage.removeItem('token')
      state.user = null
      state.token = null
      state.isAuthenticated = false
      state.loading = false
    },
    clearError: (state) => { state.error = null }
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => { state.loading = true; state.error = null })
      .addCase(login.fulfilled, (state, action) => { state.loading = false; state.isAuthenticated = true; state.user = action.payload.user; state.token = action.payload.token })
      .addCase(login.rejected, (state, action) => { state.loading = false; state.error = action.payload })
      .addCase(register.pending, (state) => { state.loading = true })
      .addCase(register.fulfilled, (state, action) => { state.loading = false; state.isAuthenticated = true; state.user = action.payload.user; state.token = action.payload.token })
      .addCase(register.rejected, (state, action) => { state.loading = false; state.error = action.payload })
      .addCase(getMe.pending, (state) => { state.loading = true })
      .addCase(getMe.fulfilled, (state, action) => { state.loading = false; state.isAuthenticated = true; state.user = action.payload.user })
      .addCase(getMe.rejected, (state) => { state.loading = false; state.isAuthenticated = false; state.user = null })
  }
})

export const { logout, clearError } = authSlice.actions
export default authSlice.reducer