// src/components/colleges/CollegeGrid.jsx - ADD THIS
import React from 'react'
import CollegeCard from './CollegeCard'

const CollegeGrid = ({ colleges, viewMode, onSave }) => {
  if (!colleges?.length) return <div className="text-center py-12 text-gray-500">No colleges found</div>

  return (
    <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
      {colleges.map(college => (<CollegeCard key={college.id} college={college} viewMode={viewMode} onSave={onSave} />))}
    </div>
  )
}

export default CollegeGrid