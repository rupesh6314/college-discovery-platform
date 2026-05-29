import React, { useState } from 'react'
import { useQuery } from 'react-query'
import { motion } from 'framer-motion'
import { FiSearch, FiX, FiPlus } from 'react-icons/fi'
import { collegeService } from '../../services/college.service'

const CollegeSelector = ({ onSelect, onClose, selectedIds = [] }) => {
  const [search, setSearch] = useState('')

  const { data, isLoading } = useQuery(
    ['colleges-search', search],
    () => collegeService.getAllColleges({ search, limit: 20 }),
    { enabled: search.length >= 2 }
  )

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative bg-white rounded-xl w-full max-w-2xl max-h-[80vh] flex flex-col shadow-xl">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-semibold">Add College to Compare</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded"><FiX size={20} /></button>
        </div>
        <div className="p-4 border-b">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Search colleges..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          {isLoading ? (
            <div className="text-center py-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div></div>
          ) : data?.data?.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No colleges found</div>
          ) : (
            <div className="space-y-2">
              {data?.data?.map(college => (
                <div key={college.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition">
                  <div className="flex items-center gap-3">
                    <img src={college.logoUrl || '/college-placeholder.png'} alt={college.name} className="w-10 h-10 rounded object-cover" />
                    <div><div className="font-medium">{college.name}</div><div className="text-sm text-gray-500">{college.city}, {college.state}</div></div>
                  </div>
                  <button onClick={() => { onSelect(college); onClose() }} disabled={selectedIds.includes(college.id)} className={`px-3 py-1 rounded text-sm ${selectedIds.includes(college.id) ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}>
                    {selectedIds.includes(college.id) ? 'Added' : <><FiPlus className="inline mr-1" size={14} /> Add</>}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

export default CollegeSelector