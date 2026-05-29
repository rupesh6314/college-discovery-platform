import React, { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useDispatch } from 'react-redux'
import { getMe } from './store/slices/authSlice'

// Layouts
import Layout from './components/layout/Layout'
import AuthLayout from './components/layout/AuthLayout'

// Pages
import HomePage from './pages/HomePage'
import CollegesPage from './pages/CollegesPage'
import CollegeDetailPage from './pages/CollegeDetailPage'
import ComparePage from './pages/ComparePage'
import DashboardPage from './pages/DashboardPage'
import SavedPage from './pages/SavedPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import CommunityPage from './pages/CommunityPage'
import QuestionDetailPage from './pages/QuestionDetailPage'

// Auth Guard
import PrivateRoute from './components/auth/PrivateRoute'

function App() {
  const dispatch = useDispatch()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      dispatch(getMe())
    }
  }, [dispatch])

  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="colleges" element={<CollegesPage />} />
          <Route path="colleges/:id" element={<CollegeDetailPage />} />
          <Route path="compare" element={<ComparePage />} />
          <Route path="community" element={<CommunityPage />} />
          <Route path="community/:id" element={<QuestionDetailPage />} />
        </Route>

        <Route path="/auth" element={<AuthLayout />}>
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
        </Route>

        <Route path="/app" element={<PrivateRoute />}>
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="saved" element={<SavedPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App" " 
