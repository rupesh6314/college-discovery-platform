// src/pages/ComparePage.jsx - CORRECTED
import React, { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { useQuery } from 'react-query'
import { motion } from 'framer-motion'
import { FiPlus, FiX, FiBarChart2, FiDownload, FiShare2 } from 'react-icons/fi'
import { useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import CompareTable from '../components/compare/CompareTable'
import CollegeSelector from '../components/compare/CollegeSelector'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import { compareService } from '../services/compare.service'
import { collegeService } from '../services/college.service'

const ComparePage = () => {
  const [searchParams] = useSearchParams()
  const [selectedColleges, setSelectedColleges] = useState([])
  const [showSelector, setShowSelector] = useState(false)
  const { isAuthenticated } = useSelector((state) => state.auth)

  useEffect(() => {
    const ids = searchParams.get('ids')
    if (ids) {
      const idArray = ids.split(',')
      fetchColleges(idArray)
    }
  }, [searchParams])

  const fetchColleges = async (ids) => {
    const colleges = await Promise.all(ids.map(id => collegeService.getCollegeById(id)))
    setSelectedColleges(colleges.map(c => c.data))
  }

  const { data, isLoading, refetch } = useQuery(
    ['compare', selectedColleges.map(c => c?.id)],
    () => compareService.compareColleges(selectedColleges.map(c => c.id)),
    { enabled: selectedColleges.length >= 2 }
  )

  const addCollege = (college) => {
    if (selectedColleges.length >= 20) {
      toast.error('You can compare up to 20 colleges at once')
      return
    }
    if (!selectedColleges.find(c => c.id === college.id)) {
      setSelectedColleges([...selectedColleges, college])
      toast.success(`${college.name} added to comparison`)
    } else {
      toast.error('College already in comparison')
    }
  }

  const removeCollege = (collegeId) => {
    setSelectedColleges(selectedColleges.filter(c => c.id !== collegeId))
    toast.success('College removed from comparison')
  }

  const clearAll = () => {
    setSelectedColleges([])
    toast.success('All colleges cleared')
  }

  const saveComparison = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to save comparisons')
      return
    }
    try {
      await compareService.saveComparison({
        name: `Comparison ${new Date().toLocaleDateString()}`,
        collegeIds: selectedColleges.map(c => c.id)
      })
      toast.success('Comparison saved successfully')
    } catch (error) {
      toast.error('Failed to save comparison')
    }
  }

  if (isLoading) return <LoadingSpinner />

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Compare Colleges</h1>
            <p className="text-gray-600 mt-1">Compare {selectedColleges.length} colleges side-by-side across 50+ parameters</p>
          </div>
          <div className="flex gap-3">
            {selectedColleges.length > 0 && (
              <>
                <button onClick={saveComparison} className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50"><FiDownload /> Save</button>
                <button onClick={clearAll} className="flex items-center gap-2 px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50"><FiX /> Clear All</button>
              </>
            )}
            <button onClick={() => setShowSelector(true)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"><FiPlus /> Add College</button>
          </div>
        </div>

        {selectedColleges.length > 0 && (
          <div className="flex flex-wrap gap-3 mb-6">
            {selectedColleges.map(college => (
              <div key={college.id} className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg shadow-sm">
                <img src={college.logoUrl || '/college-placeholder.png'} alt={college.name} className="w-8 h-8 rounded object-cover" />
                <span className="font-medium">{college.shortName || college.name.split(' ')[0]}</span>
                <button onClick={() => removeCollege(college.id)} className="text-gray-400 hover:text-red-500"><FiX size={16} /></button>
              </div>
            ))}
          </div>
        )}

        {selectedColleges.length >= 2 && data?.success ? (
          <CompareTable colleges={data.colleges} comparisonMatrix={data.comparisonMatrix} insights={data.insights} rankings={data.rankings} />
        ) : selectedColleges.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl"><FiBarChart2 className="w-20 h-20 text-gray-300 mx-auto mb-4" /><h3 className="text-xl font-semibold mb-2">No colleges selected</h3><p className="text-gray-500 mb-4">Add at least 2 colleges to start comparing</p><button onClick={() => setShowSelector(true)} className="btn-primary">Browse Colleges</button></div>
        ) : selectedColleges.length === 1 ? (
          <div className="text-center py-20 bg-white rounded-xl"><p className="text-gray-500 mb-4">Add one more college to compare</p><button onClick={() => setShowSelector(true)} className="btn-primary">Add Another College</button></div>
        ) : null}

        {showSelector && <CollegeSelector onSelect={addCollege} onClose={() => setShowSelector(false)} selectedIds={selectedColleges.map(c => c.id)} />}
      </div>
    </div>
  )
}

export default ComparePage