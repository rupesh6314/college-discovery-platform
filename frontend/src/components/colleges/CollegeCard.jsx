// frontend/src/components/colleges/CollegeCard.jsx
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiMapPin, FiDollarSign, FiStar, FiTrendingUp, FiHeart, FiImage } from 'react-icons/fi'
import { useSelector } from 'react-redux'
import toast from 'react-hot-toast'

const CollegeCard = ({ college, viewMode = 'grid', onSave }) => {
  const { isAuthenticated } = useSelector((state) => state.auth)
  const [imageError, setImageError] = useState(false)

  // Helper to get college initials for placeholder
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .slice(0, 2)
      .join('')
      .toUpperCase()
  }

  // Use logoUrl or fallback to placeholder
  const imageUrl = !imageError && college.logoUrl 
    ? college.logoUrl 
    : null

  const CardContent = () => (
    <>
      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-blue-600 to-indigo-800">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={college.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={() => setImageError(true)}
            loading="lazy"
          />
        ) : (
          // Professional branded placeholder
          <div className="w-full h-full flex flex-col items-center justify-center text-white">
            <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mb-3 backdrop-blur-sm">
              <span className="text-3xl font-bold text-white">
                {getInitials(college.name)}
              </span>
            </div>
            <div className="text-center px-4">
              <h3 className="font-bold text-lg line-clamp-1">{college.name}</h3>
              <p className="text-sm text-blue-200 mt-1">{college.type || 'College'}</p>
            </div>
          </div>
        )}
        
        {/* Save Button */}
        <button
          onClick={(e) => {
            e.preventDefault()
            if (isAuthenticated) {
              onSave && onSave()
            } else {
              toast.error('Please login to save colleges')
            }
          }}
          className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition z-10"
        >
          <FiHeart className={college.isSaved ? 'fill-red-500 text-red-500' : 'text-gray-600'} />
        </button>
        
        {/* Type Badge */}
        {college.type && (
          <span className="absolute bottom-4 left-4 px-3 py-1 bg-black/60 backdrop-blur rounded-full text-white text-xs font-medium">
            {college.type}
          </span>
        )}
        
        {/* Rating Badge (if high rating) */}
        {college.overallRating >= 4.5 && (
          <span className="absolute top-4 left-4 px-2 py-1 bg-yellow-500 text-white rounded-lg text-xs font-bold flex items-center gap-1">
            <FiStar className="fill-white" size={12} /> Top Rated
          </span>
        )}
      </div>
      
      <div className="p-4">
        <Link to={`/colleges/${college.id}`}>
          <h3 className="font-bold text-lg mb-1 hover:text-blue-600 transition line-clamp-1">
            {college.name}
          </h3>
        </Link>
        
        <div className="flex items-center gap-2 text-gray-600 text-sm mb-2">
          <FiMapPin className="w-4 h-4 flex-shrink-0" />
          <span className="truncate">{college.city}, {college.state}</span>
        </div>
        
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center gap-1">
            <FiStar className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="font-semibold">{college.overallRating || 'N/A'}</span>
          </div>
          <span className="text-gray-400">•</span>
          <span className="text-gray-600 text-sm">{college.ratingCount || 0} reviews</span>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2 text-sm">
            <FiDollarSign className="text-green-600 flex-shrink-0" />
            <div>
              <div className="text-gray-500 text-xs">Total Fee</div>
              <div className="font-semibold text-sm">
                ₹{(college.totalFee || 0).toLocaleString()}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <FiTrendingUp className="text-blue-600 flex-shrink-0" />
            <div>
              <div className="text-gray-500 text-xs">Avg Package</div>
              <div className="font-semibold text-sm">
                ₹{((college.averagePackage || 0) / 100000).toFixed(1)}L
              </div>
            </div>
          </div>
        </div>
        
        {/* Placement Rate Indicator */}
        {college.placementRate && (
          <div className="mt-3 pt-3 border-t">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>Placement Rate</span>
              <span className="font-semibold">{college.placementRate}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div 
                className="bg-green-500 h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${college.placementRate}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </>
  )

  if (viewMode === 'list') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden group"
      >
        <div className="flex flex-col sm:flex-row">
          <div className="sm:w-48 h-48 sm:h-auto bg-gradient-to-br from-blue-600 to-indigo-800">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={college.name}
                className="w-full h-full object-cover"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-white p-4">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-2">
                  <span className="text-2xl font-bold">{getInitials(college.name)}</span>
                </div>
                <p className="text-center text-sm font-medium line-clamp-2">{college.name}</p>
              </div>
            )}
          </div>
          <div className="flex-1"><CardContent /></div>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden group"
    >
      <CardContent />
    </motion.div>
  )
}

export default CollegeCard