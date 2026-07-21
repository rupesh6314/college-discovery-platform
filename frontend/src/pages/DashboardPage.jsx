import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { useQuery } from 'react-query'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { FiBookmark, FiBarChart2, FiStar, FiMessageCircle, FiUser, FiMail, FiMapPin, FiEdit2, FiArrowLeft, FiX, FiCheck } from 'react-icons/fi'
import { userService } from '../services/user.service'
import { authService } from '../services/auth.service'
import LoadingSpinner from '../components/ui/LoadingSpinner'

// Note: You might need to update the redux auth state after profile update. 
// Assuming a 'setUser' action exists, or just forcing a reload.
// For now, we will just update local state or reload if needed.

const DashboardPage = () => {
  const { user } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { data, isLoading } = useQuery('user-stats', () => userService.getStats())
  
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  
  // Email change state
  const [showEmailModal, setShowEmailModal] = useState(false)
  const [pendingEmail, setPendingEmail] = useState('')
  const [emailCode, setEmailCode] = useState('')
  const [isRequestingEmail, setIsRequestingEmail] = useState(false)
  const [isVerifyingEmail, setIsVerifyingEmail] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      name: user?.name || '',
      phone: user?.phone || '',
      city: user?.city || '',
      state: user?.state || '',
      education: user?.education || '',
    }
  })

  if (isLoading) return <LoadingSpinner />

  const stats = [
    { icon: FiBookmark, label: 'Saved Colleges', value: data?.savedCount || 0, color: 'text-blue-600', bg: 'bg-blue-100', link: '/app/saved' },
    { icon: FiBarChart2, label: 'Saved Comparisons', value: data?.comparisonCount || 0, color: 'text-green-600', bg: 'bg-green-100', link: '/app/saved' },
    { icon: FiStar, label: 'Reviews Written', value: data?.reviewCount || 0, color: 'text-yellow-600', bg: 'bg-yellow-100', link: '/colleges' },
    { icon: FiMessageCircle, label: 'Questions Asked', value: data?.questionCount || 0, color: 'text-purple-600', bg: 'bg-purple-100', link: '/community' }
  ]

  const onSubmitProfile = async (formData) => {
    setIsSaving(true)
    try {
      await authService.updateProfile(formData)
      toast.success('Profile updated successfully! Refreshing...')
      setIsEditing(false)
      // Force reload to update Redux state (simplest way without diving into their redux setup)
      setTimeout(() => window.location.reload(), 1000)
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to update profile')
    } finally {
      setIsSaving(false)
    }
  }

  const onRequestEmailChange = async (e) => {
    e.preventDefault()
    if (!pendingEmail || pendingEmail === user?.email) {
      return toast.error('Please enter a new email address')
    }
    setIsRequestingEmail(true)
    try {
      await authService.requestEmailChange(pendingEmail)
      toast.success(`Verification code sent to ${pendingEmail}`)
      setShowEmailModal(true)
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to request email change')
    } finally {
      setIsRequestingEmail(false)
    }
  }

  const onVerifyEmailChange = async (e) => {
    e.preventDefault()
    if (!emailCode || emailCode.length !== 6) {
      return toast.error('Please enter the 6-character code')
    }
    setIsVerifyingEmail(true)
    try {
      await authService.verifyEmailChange(emailCode)
      toast.success('Email updated successfully! Refreshing...')
      setShowEmailModal(false)
      setTimeout(() => window.location.reload(), 1000)
    } catch (error) {
      toast.error(error.response?.data?.error || 'Invalid verification code')
    } finally {
      setIsVerifyingEmail(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 relative">
      <div className="container-custom">
        
        {/* Top Navigation Bar inside Dashboard */}
        <div className="flex justify-between items-center mb-6">
          <Link to="/" className="flex items-center text-gray-600 hover:text-blue-600 font-medium transition">
            <FiArrowLeft className="mr-2" /> Back to Home Page
          </Link>
          {!isEditing && (
            <button 
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-100 transition font-medium"
            >
              <FiEdit2 size={16} /> Edit Profile
            </button>
          )}
        </div>

        {/* Profile Section */}
        {isEditing ? (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border border-gray-100">
            <div className="flex justify-between items-center mb-6 border-b pb-4">
              <h2 className="text-xl font-bold text-gray-800">Edit Profile</h2>
              <button onClick={() => setIsEditing(false)} className="text-gray-400 hover:text-gray-600">
                <FiX size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit(onSubmitProfile)} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input {...register('name', { required: 'Name is required' })} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input {...register('phone')} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="+91 9876543210" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <input {...register('city')} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                <input {...register('state')} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Current Education</label>
                <input {...register('education')} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="e.g. 12th Standard, B.Tech 1st Year" />
              </div>
              
              <div className="md:col-span-2 border-t pt-6 mt-2">
                <h3 className="text-md font-semibold text-gray-800 mb-4">Change Email Address</h3>
                <p className="text-sm text-gray-500 mb-4">To change your email, we need to send a verification code to your new email address first.</p>
                
                <div className="flex gap-4">
                  <input 
                    type="email" 
                    value={pendingEmail}
                    onChange={(e) => setPendingEmail(e.target.value)}
                    className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" 
                    placeholder="Enter new email address" 
                  />
                  <button 
                    type="button" 
                    onClick={onRequestEmailChange}
                    disabled={isRequestingEmail || !pendingEmail}
                    className="bg-gray-800 text-white px-6 py-2 rounded-lg hover:bg-gray-900 transition disabled:opacity-50 whitespace-nowrap"
                  >
                    {isRequestingEmail ? 'Sending...' : 'Verify New Email'}
                  </button>
                </div>
              </div>

              <div className="md:col-span-2 flex justify-end gap-4 mt-6 border-t pt-6">
                <button type="button" onClick={() => setIsEditing(false)} className="px-6 py-2 border rounded-lg text-gray-600 hover:bg-gray-50">Cancel</button>
                <button type="submit" disabled={isSaving} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border border-gray-100">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-4xl font-bold shadow-md">
                {user?.name?.[0]?.toUpperCase()}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{user?.name}</h1>
                <div className="flex items-center gap-2 text-gray-600 mt-1">
                  <FiMail className="text-gray-400" /> {user?.email}
                </div>
                <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-600">
                  {user?.city && (
                    <div className="flex items-center gap-1 bg-gray-50 px-3 py-1 rounded-full border border-gray-200">
                      <FiMapPin className="text-blue-500" /> {user.city}{user?.state ? `, ${user.state}` : ''}
                    </div>
                  )}
                  {user?.education && (
                    <div className="flex items-center gap-1 bg-gray-50 px-3 py-1 rounded-full border border-gray-200">
                      <FiUser className="text-blue-500" /> {user.education}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, idx) => (
            <Link key={idx} to={stat.link} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-100 transition group">
              <div className={`w-12 h-12 ${stat.bg} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}><stat.icon className={`w-6 h-6 ${stat.color}`} /></div>
              <div className="text-3xl font-bold text-gray-800">{stat.value}</div>
              <div className="text-gray-500 text-sm mt-1">{stat.label}</div>
            </Link>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2"><FiBarChart2 className="text-blue-500" /> Recent Activity</h3>
            {data?.recentActivities?.length > 0 ? (
              <div className="space-y-4">
                {data.recentActivities.map((activity, i) => (
                  <div key={i} className="flex items-start gap-3 pb-4 border-b last:border-0 last:pb-0">
                    <div className="w-2 h-2 rounded-full bg-blue-500 mt-2"></div>
                    <p className="text-gray-600">{activity}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                No recent activity to show
              </div>
            )}
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2"><FiStar className="text-yellow-500" /> Recommended for You</h3>
            {data?.recommendations?.length > 0 ? (
              <div className="space-y-3">
                {data.recommendations.map((college, i) => (
                  <Link key={i} to={`/colleges/${college.id}`} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition border border-transparent hover:border-gray-200">
                    <span className="font-medium text-gray-800">{college.name}</span>
                    <FiArrowLeft className="text-blue-500 transform rotate-180" />
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                Complete your profile to get personalized college recommendations
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Email Verification Modal */}
      {showEmailModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-fade-in-up">
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiMail size={32} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Verify New Email</h2>
              <p className="text-gray-600 mb-6">
                We sent a 6-character verification code to <br />
                <span className="font-medium text-gray-900">{pendingEmail}</span>
              </p>
              
              <form onSubmit={onVerifyEmailChange}>
                <input 
                  type="text" 
                  value={emailCode}
                  onChange={(e) => setEmailCode(e.target.value.toUpperCase())}
                  placeholder="Enter 6-char code" 
                  maxLength={6}
                  className="w-full text-center text-2xl tracking-widest font-mono py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 mb-6"
                />
                
                <div className="flex gap-4">
                  <button 
                    type="button" 
                    onClick={() => setShowEmailModal(false)}
                    className="flex-1 py-3 text-gray-600 hover:bg-gray-50 rounded-xl font-medium transition"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    disabled={isVerifyingEmail || emailCode.length !== 6}
                    className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition disabled:opacity-50"
                  >
                    {isVerifyingEmail ? 'Verifying...' : 'Verify & Save'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default DashboardPage