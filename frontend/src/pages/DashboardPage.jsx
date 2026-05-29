import React from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useQuery } from 'react-query'
import { motion } from 'framer-motion'
import { FiBookmark, FiBarChart2, FiStar, FiMessageCircle, FiUser, FiMail, FiMapPin } from 'react-icons/fi'
import { userService } from '../services/user.service'
import LoadingSpinner from '../components/ui/LoadingSpinner'

const DashboardPage = () => {
  const { user } = useSelector((state) => state.auth)
  const { data, isLoading } = useQuery('user-stats', () => userService.getStats())

  if (isLoading) return <LoadingSpinner />

  const stats = [
    { icon: FiBookmark, label: 'Saved Colleges', value: data?.savedCount || 0, color: 'text-blue-600', bg: 'bg-blue-100', link: '/app/saved' },
    { icon: FiBarChart2, label: 'Saved Comparisons', value: data?.comparisonCount || 0, color: 'text-green-600', bg: 'bg-green-100', link: '/app/saved' },
    { icon: FiStar, label: 'Reviews Written', value: data?.reviewCount || 0, color: 'text-yellow-600', bg: 'bg-yellow-100', link: '/colleges' },
    { icon: FiMessageCircle, label: 'Questions Asked', value: data?.questionCount || 0, color: 'text-purple-600', bg: 'bg-purple-100', link: '/community' }
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom">
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white text-3xl font-bold">{user?.name?.[0]}</div>
            <div><h1 className="text-2xl font-bold">{user?.name}</h1><p className="text-gray-600">{user?.email}</p><div className="flex gap-4 mt-2 text-sm text-gray-500">{user?.city && <div className="flex items-center gap-1"><FiMapPin size={14} /> {user.city}</div>}{user?.education && <div>{user.education}</div>}</div></div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, idx) => (
            <Link key={idx} to={stat.link} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition">
              <div className={`w-12 h-12 ${stat.bg} rounded-lg flex items-center justify-center mb-3`}><stat.icon className={`w-6 h-6 ${stat.color}`} /></div>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="text-gray-600">{stat.label}</div>
            </Link>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm"><h3 className="font-semibold mb-4">Recent Activity</h3>{data?.recentActivities?.length > 0 ? data.recentActivities.map((activity, i) => (<div key={i} className="py-2 border-b last:border-0">{activity}</div>)) : <p className="text-gray-500">No recent activity</p>}</div>
          <div className="bg-white rounded-xl p-6 shadow-sm"><h3 className="font-semibold mb-4">Recommended for You</h3>{data?.recommendations?.length > 0 ? data.recommendations.map((college, i) => (<Link key={i} to={`/colleges/${college.id}`} className="block py-2 border-b last:border-0 hover:text-blue-600">{college.name}</Link>)) : <p className="text-gray-500">Complete your profile for recommendations</p>}</div>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage