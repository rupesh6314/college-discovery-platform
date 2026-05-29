import React from 'react'
import { useQuery } from 'react-query'
import { Link } from 'react-router-dom'
import { FiTrash2, FiStar, FiMapPin, FiDollarSign } from 'react-icons/fi'
import toast from 'react-hot-toast'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import { userService } from '../services/user.service'

const SavedPage = () => {
  const { data, isLoading, refetch } = useQuery('saved-colleges', () => userService.getSavedColleges())

  const handleRemove = async (collegeId) => {
    try {
      await userService.removeSavedCollege(collegeId)
      toast.success('Removed from saved')
      refetch()
    } catch (error) {
      toast.error('Failed to remove')
    }
  }

  if (isLoading) return <LoadingSpinner />

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom">
        <h1 className="text-3xl font-bold mb-2">Saved Colleges</h1>
        <p className="text-gray-600 mb-6">Colleges you've bookmarked for later</p>
        {data?.length === 0 ? (<div className="text-center py-12 bg-white rounded-xl"><p className="text-gray-500 mb-4">No saved colleges yet</p><Link to="/colleges" className="btn-primary">Browse Colleges</Link></div>) : (<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{data?.map((item) => (<div key={item.id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition"><div className="relative h-40"><img src={item.college.coverImageUrl || '/college-cover.jpg'} alt={item.college.name} className="w-full h-full object-cover" /><button onClick={() => handleRemove(item.collegeId)} className="absolute top-2 right-2 p-2 bg-white rounded-full shadow hover:bg-red-50"><FiTrash2 className="text-red-500" /></button></div><div className="p-4"><Link to={`/colleges/${item.college.id}`}><h3 className="font-semibold text-lg hover:text-blue-600">{item.college.name}</h3></Link><div className="flex items-center gap-2 text-sm text-gray-500 mt-1"><FiMapPin size={14} /> {item.college.city}, {item.college.state}</div><div className="flex items-center justify-between mt-3"><div className="flex items-center gap-1"><FiStar className="text-yellow-400" /> <span className="font-semibold">{item.college.overallRating}</span></div><div className="flex items-center gap-1 text-gray-600"><FiDollarSign /> ₹{item.college.totalFee?.toLocaleString()}</div></div><Link to={`/colleges/${item.college.id}`} className="block mt-3 text-center text-blue-600 hover:text-blue-700">View Details →</Link></div></div>))}</div>)}
      </div>
    </div>
  )
}

export default SavedPage