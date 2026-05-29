// src/components/ui/SkeletonCard.jsx - ADD THIS
import React from 'react'

const SkeletonCard = ({ variant = 'grid' }) => {
  if (variant === 'list') {
    return (<div className="bg-white rounded-xl p-4 animate-pulse"><div className="flex gap-4"><div className="w-32 h-32 bg-gray-200 rounded"></div><div className="flex-1"><div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div><div className="h-3 bg-gray-200 rounded w-1/2"></div></div></div></div>)
  }
  return (<div className="bg-white rounded-xl overflow-hidden animate-pulse"><div className="h-48 bg-gray-200"></div><div className="p-4"><div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div><div className="h-4 bg-gray-200 rounded w-1/2"></div></div></div>)
}

export default SkeletonCard