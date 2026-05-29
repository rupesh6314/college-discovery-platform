import React, { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery } from 'react-query'
import { motion } from 'framer-motion'
import { FiMapPin, FiDollarSign, FiTrendingUp, FiStar, FiUsers, FiAward, FiBookOpen, FiWifi, FiHome, FiActivity } from 'react-icons/fi'
import { useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import ReviewList from '../components/reviews/ReviewList'
import ReviewForm from '../components/reviews/ReviewForm'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import { collegeService } from '../services/college.service'

const CollegeDetailPage = () => {
  const { id } = useParams()
  const [activeTab, setActiveTab] = useState('overview')
  const { isAuthenticated } = useSelector((state) => state.auth)

  const { data, isLoading, refetch } = useQuery(['college', id], () => collegeService.getCollegeById(id))

  if (isLoading) return <LoadingSpinner />
  if (!data?.data) return <div className="text-center py-12">College not found</div>

  const college = data.data

  const tabs = [
    { id: 'overview', name: 'Overview' },
    { id: 'placements', name: 'Placements' },
    { id: 'reviews', name: 'Reviews' }
  ]

  const handleSave = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to save colleges')
      return
    }
    try {
      await collegeService.saveCollege(college.id)
      toast.success('College saved successfully')
    } catch (error) {
      toast.error('Failed to save college')
    }
  }

  // Safely parse JSON fields
  const examsAccepted = college.examsAccepted ? 
    (typeof college.examsAccepted === 'string' ? JSON.parse(college.examsAccepted) : college.examsAccepted) : []
  
  const topRecruiters = college.topRecruiters ?
    (typeof college.topRecruiters === 'string' ? JSON.parse(college.topRecruiters) : college.topRecruiters) : []

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-white border-b">
        <div className="container-custom py-8">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">{college.name}</h1>
              <div className="flex items-center gap-4 text-gray-600 mb-4 flex-wrap">
                <div className="flex items-center gap-1"><FiMapPin /> {college.city}, {college.state}</div>
                <div className="flex items-center gap-1"><FiStar className="text-yellow-400 fill-yellow-400" /> {college.overallRating || 'N/A'} ({college.ratingCount || 0} reviews)</div>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">{college.type || 'N/A'}</span>
                {college.ranking && <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">NIRF Rank #{college.ranking}</span>}
                {college.established && <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">Est. {college.established}</span>}
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={handleSave} className="px-6 py-2 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition">Save College</button>
              <Link to={`/compare?ids=${college.id}`} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">Compare</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b bg-white sticky top-16 z-40">
        <div className="container-custom">
          <div className="flex overflow-x-auto gap-8">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-2 border-b-2 transition whitespace-nowrap ${activeTab === tab.id ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600 hover:text-gray-900'}`}
              >
                {tab.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container-custom py-8">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h2 className="text-xl font-bold mb-4">About College</h2>
                <p className="text-gray-600 leading-relaxed">
                  {college.description || `${college.name} is a premier educational institution located in ${college.city}, ${college.state}. Established in ${college.established || 'the year'}, it has consistently ranked among the top colleges in India.`}
                </p>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h2 className="text-xl font-bold mb-4">Key Highlights</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div><div className="text-gray-500 text-sm">Established</div><div className="font-semibold">{college.established || 'N/A'}</div></div>
                  <div><div className="text-gray-500 text-sm">Campus Size</div><div className="font-semibold">{college.campusSize ? `${college.campusSize} acres` : 'N/A'}</div></div>
                  <div><div className="text-gray-500 text-sm">Ranking</div><div className="font-semibold">#{college.ranking || 'N/A'}</div></div>
                  <div><div className="text-gray-500 text-sm">Type</div><div className="font-semibold">{college.type || 'N/A'}</div></div>
                </div>
              </div>

              {/* Exams Accepted */}
              {examsAccepted.length > 0 && (
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <h2 className="text-xl font-bold mb-4">Exams Accepted</h2>
                  <div className="flex flex-wrap gap-2">
                    {examsAccepted.map((exam, i) => (
                      <span key={i} className="px-3 py-1 bg-gray-100 rounded-full text-sm">{exam}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6">
                <h3 className="font-bold mb-3">Quick Stats</h3>
                <div className="space-y-3">
                  <div className="flex justify-between"><span className="text-gray-600">Total Fees</span><span className="font-semibold">₹{(college.totalFee || 0).toLocaleString()}</span></div>
                  <div className="flex justify-between"><span className="text-gray-600">Avg Package</span><span className="font-semibold">₹{((college.averagePackage || 0) / 100000).toFixed(1)} LPA</span></div>
                  <div className="flex justify-between"><span className="text-gray-600">Placement Rate</span><span className="font-semibold">{college.placementRate || 'N/A'}%</span></div>
                </div>
              </div>

              {topRecruiters.length > 0 && (
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <h3 className="font-bold mb-3">Top Recruiters</h3>
                  <div className="flex flex-wrap gap-2">
                    {topRecruiters.map((recruiter, i) => (
                      <span key={i} className="px-2 py-1 bg-gray-100 rounded text-sm">{recruiter}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'placements' && (
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-bold mb-6">Placement Statistics</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">₹{((college.averagePackage || 0) / 100000).toFixed(1)} LPA</div>
                <div className="text-gray-600">Average Package</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">₹{((college.highestPackage || 0) / 100000).toFixed(1)} LPA</div>
                <div className="text-gray-600">Highest Package</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{college.placementRate || 'N/A'}%</div>
                <div className="text-gray-600">Placement Rate</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">{topRecruiters.length || 0}</div>
                <div className="text-gray-600">Top Recruiters</div>
              </div>
            </div>
            
            {topRecruiters.length > 0 && (
              <>
                <h3 className="font-semibold mb-3">Top Recruiters</h3>
                <div className="flex flex-wrap gap-2">
                  {topRecruiters.map((recruiter, i) => (
                    <span key={i} className="px-3 py-1 bg-gray-100 rounded-full text-sm">{recruiter}</span>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="space-y-6">
            {isAuthenticated && <ReviewForm collegeId={college.id} onSuccess={() => refetch()} />}
            <ReviewList collegeId={college.id} />
          </div>
        )}
      </div>
    </div>
  )
}

export default CollegeDetailPage