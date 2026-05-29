// src/components/reviews/ReviewList.jsx - ADD THIS
import React from 'react'
import { useQuery } from 'react-query'
import { motion } from 'framer-motion'
import { formatDistanceToNow } from 'date-fns'
import { FiStar, FiUser, FiClock, FiThumbsUp } from 'react-icons/fi'
import { reviewService } from '../../services/review.service'
import LoadingSpinner from '../ui/LoadingSpinner'

const ReviewList = ({ collegeId }) => {
  const { data, isLoading } = useQuery(['reviews', collegeId], () => reviewService.getReviews(collegeId, { limit: 10 }))

  if (isLoading) return <LoadingSpinner />
  if (!data?.reviews?.length) return <div className="text-center py-8 text-gray-500">No reviews yet. Be the first to review!</div>

  return (
    <div className="space-y-4">
      {data.reviews.map((review) => (
        <motion.div key={review.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex justify-between items-start mb-3"><div><div className="flex items-center gap-2 mb-1"><div className="font-semibold">{review.user?.name}</div><div className="flex items-center gap-0.5">{[...Array(5)].map((_, i) => (<FiStar key={i} size={14} className={i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'} />))}</div></div><div className="text-sm text-gray-500 flex items-center gap-3"><span className="flex items-center gap-1"><FiClock size={12} /> {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}</span></div></div><button className="flex items-center gap-1 text-gray-400 hover:text-blue-600"><FiThumbsUp size={14} /> Helpful</button></div>
          <h4 className="font-semibold mb-2">{review.title}</h4>
          <p className="text-gray-700">{review.content}</p>
          {review.pros && <div className="mt-3 text-sm text-green-600">✓ Pros: {review.pros}</div>}
          {review.cons && <div className="text-sm text-red-600">✗ Cons: {review.cons}</div>}
        </motion.div>
      ))}
    </div>
  )
}

export default ReviewList