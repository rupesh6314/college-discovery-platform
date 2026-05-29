import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useQuery } from 'react-query'
import { motion, AnimatePresence } from 'framer-motion'
import { FiFilter, FiGrid, FiList } from 'react-icons/fi'
import toast from 'react-hot-toast'
import { useSelector } from 'react-redux'
import CollegeCard from '../components/colleges/CollegeCard'
import CollegeFilters from '../components/colleges/CollegeFilters'
import CollegeSearch from '../components/colleges/CollegeSearch'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import Pagination from '../components/ui/Pagination'
import { collegeService } from '../services/college.service'

const CollegesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [viewMode, setViewMode] = useState('grid')
  const [showFilters, setShowFilters] = useState(false)
  const [page, setPage] = useState(1)
  const { isAuthenticated } = useSelector((state) => state.auth)
  
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    city: searchParams.get('city') || '',
    state: searchParams.get('state') || '',
    type: searchParams.get('type') || '',
    minRating: searchParams.get('minRating') || '',
    maxFee: searchParams.get('maxFee') || '',
    minPackage: searchParams.get('minPackage') || '',
    sortBy: searchParams.get('sortBy') || 'overallRating',
    sortOrder: searchParams.get('sortOrder') || 'desc'
  })

  const { data, isLoading, error, refetch } = useQuery(
    ['colleges', filters, page],
    () => collegeService.getAllColleges({ ...filters, page, limit: 12 }),
    { keepPreviousData: true }
  )

    // Replace with this - only updates URL when filters actually change
    useEffect(() => {
        const params = new URLSearchParams()
        Object.entries(filters).forEach(([key, value]) => {
            if (value && value !== '' && value !== 'all') {
            params.set(key, value)
            }
        })
        if (page > 1) params.set('page', page)
        
        // Only update if different to prevent loops
        const currentParams = new URLSearchParams(window.location.search)
        if (params.toString() !== currentParams.toString()) {
            setSearchParams(params, { replace: true })
        }
    }, [filters, page])

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }))
    setPage(1)
  }

  const handleSaveCollege = async (collegeId) => {
    if (!isAuthenticated) {
      toast.error('Please login to save colleges')
      return
    }
    try {
      await collegeService.saveCollege(collegeId)
      toast.success('College saved successfully')
      refetch()
    } catch (error) {
      toast.error('Failed to save college')
    }
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Failed to load colleges</p>
          <button onClick={() => refetch()} className="btn-primary">Try Again</button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b sticky top-16 z-40">
        <div className="container-custom py-4">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <CollegeSearch value={filters.search} onChange={(search) => handleFilterChange({ search })} />
            </div>
            <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
              <button onClick={() => setViewMode('grid')} className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white shadow-sm' : ''}`}><FiGrid /></button>
              <button onClick={() => setViewMode('list')} className={`p-2 rounded ${viewMode === 'list' ? 'bg-white shadow-sm' : ''}`}><FiList /></button>
            </div>
            <button onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50">
              <FiFilter /> Filters
            </button>
          </div>
        </div>
      </div>

      <div className="container-custom py-8">
        <div className="flex gap-8">
          <AnimatePresence>
            {showFilters && (
              <motion.aside initial={{ width: 0, opacity: 0 }} animate={{ width: 280, opacity: 1 }} exit={{ width: 0, opacity: 0 }} className="hidden lg:block flex-shrink-0">
                <CollegeFilters filters={filters} onChange={handleFilterChange} />
              </motion.aside>
            )}
          </AnimatePresence>

          <div className="flex-1">
            <div className="mb-4 text-gray-600">Found {data?.pagination?.total || 0} colleges</div>

            {isLoading ? (
              <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
                {[...Array(6)].map((_, i) => <div key={i} className="bg-gray-200 rounded-xl h-64 animate-pulse"></div>)}
              </div>
            ) : data?.data?.length === 0 ? (
              <div className="text-center py-12"><p className="text-gray-500">No colleges found</p></div>
            ) : (
              <>
                <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
                  {data?.data?.map((college) => (
                    <CollegeCard key={college.id} college={college} viewMode={viewMode} onSave={() => handleSaveCollege(college.id)} />
                  ))}
                </div>
                {data?.pagination && data.pagination.pages > 1 && (
                  <Pagination currentPage={page} totalPages={data.pagination.pages} onPageChange={setPage} />
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {showFilters && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setShowFilters(false)} />
          <div className="absolute right-0 top-0 h-full w-80 bg-white shadow-xl overflow-y-auto">
            <CollegeFilters filters={filters} onChange={handleFilterChange} />
          </div>
        </div>
      )}
    </div>
  )
}

export default CollegesPage