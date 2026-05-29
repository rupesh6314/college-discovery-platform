// src/components/colleges/CollegeFilters.jsx - ADD THIS
import React, { useState } from 'react'
import { FiX, FiSliders } from 'react-icons/fi'

const CollegeFilters = ({ filters, onChange }) => {
  const [localFilters, setLocalFilters] = useState(filters)

  const handleChange = (key, value) => {
    const newFilters = { ...localFilters, [key]: value }
    setLocalFilters(newFilters)
    onChange(newFilters)
  }

  const resetFilters = () => {
    const emptyFilters = { search: '', city: '', state: '', type: '', minRating: '', maxFee: '', minPackage: '', sortBy: 'overallRating', sortOrder: 'desc' }
    setLocalFilters(emptyFilters)
    onChange(emptyFilters)
  }

  return (
    <div className="bg-white rounded-xl p-5 shadow-sm">
      <div className="flex justify-between items-center mb-4"><h3 className="font-semibold flex items-center gap-2"><FiSliders /> Filters</h3><button onClick={resetFilters} className="text-sm text-red-600 hover:text-red-700">Reset All</button></div>
      <div className="space-y-4">
        <div><label className="block text-sm font-medium mb-1">City</label><input type="text" value={localFilters.city || ''} onChange={(e) => handleChange('city', e.target.value)} className="w-full px-3 py-2 border rounded-lg" placeholder="Enter city" /></div>
        <div><label className="block text-sm font-medium mb-1">State</label><input type="text" value={localFilters.state || ''} onChange={(e) => handleChange('state', e.target.value)} className="w-full px-3 py-2 border rounded-lg" placeholder="Enter state" /></div>
        <div><label className="block text-sm font-medium mb-1">College Type</label><select value={localFilters.type || ''} onChange={(e) => handleChange('type', e.target.value)} className="w-full px-3 py-2 border rounded-lg"><option value="">All Types</option><option value="GOVERNMENT">Government</option><option value="PRIVATE">Private</option><option value="DEEMED">Deemed</option><option value="CENTRAL">Central</option></select></div>
        <div><label className="block text-sm font-medium mb-1">Min Rating</label><select value={localFilters.minRating || ''} onChange={(e) => handleChange('minRating', e.target.value)} className="w-full px-3 py-2 border rounded-lg"><option value="">Any Rating</option><option value="4.5">4.5+</option><option value="4.0">4.0+</option><option value="3.5">3.5+</option><option value="3.0">3.0+</option></select></div>
        <div><label className="block text-sm font-medium mb-1">Max Fee (₹ Lakhs)</label><select value={localFilters.maxFee || ''} onChange={(e) => handleChange('maxFee', e.target.value)} className="w-full px-3 py-2 border rounded-lg"><option value="">Any</option><option value="500000">Under ₹5L</option><option value="1000000">Under ₹10L</option><option value="1500000">Under ₹15L</option><option value="2000000">Under ₹20L</option></select></div>
        <div><label className="block text-sm font-medium mb-1">Sort By</label><select value={localFilters.sortBy || 'overallRating'} onChange={(e) => handleChange('sortBy', e.target.value)} className="w-full px-3 py-2 border rounded-lg"><option value="overallRating">Rating</option><option value="totalFee">Fee (Low to High)</option><option value="averagePackage">Average Package</option><option value="ranking">Ranking</option><option value="name">Name</option></select></div>
      </div>
    </div>
  )
}

export default CollegeFilters