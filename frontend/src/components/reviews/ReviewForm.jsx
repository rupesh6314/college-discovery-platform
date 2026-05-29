// src/components/reviews/ReviewForm.jsx - ADD THIS
import React, { useState } from 'react'
import { useMutation, useQueryClient } from 'react-query'
import { useSelector } from 'react-redux'
import { FiStar } from 'react-icons/fi'
import toast from 'react-hot-toast'
import { reviewService } from '../../services/review.service'

const ReviewForm = ({ collegeId, onSuccess }) => {
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const { isAuthenticated } = useSelector((state) => state.auth)
  const queryClient = useQueryClient()

  const mutation = useMutation(
    () => reviewService.createReview(collegeId, { rating, title, content }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['college', collegeId])
        queryClient.invalidateQueries(['reviews', collegeId])
        setRating(0)
        setTitle('')
        setContent('')
        toast.success('Review posted successfully!')
        if (onSuccess) onSuccess()
      },
      onError: () => toast.error('Failed to post review')
    }
  )

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!isAuthenticated) { toast.error('Please login to write a review'); return }
    if (rating === 0) { toast.error('Please select a rating'); return }
    mutation.mutate()
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 shadow-sm mb-6">
      <h3 className="text-lg font-semibold mb-4">Write a Review</h3>
      <div className="mb-4"><label className="block text-sm font-medium mb-2">Rating</label><div className="flex gap-1">{[...Array(5)].map((_, i) => { const starValue = i + 1; return (<button key={i} type="button" onClick={() => setRating(starValue)} onMouseEnter={() => setHoverRating(starValue)} onMouseLeave={() => setHoverRating(0)} className="focus:outline-none"><FiStar size={28} className={`${(hoverRating || rating) >= starValue ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} /></button>) })}</div></div>
      <div className="mb-4"><label className="block text-sm font-medium mb-2">Title</label><input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-4 py-2 border rounded-lg" placeholder="Summarize your experience" required /></div>
      <div className="mb-4"><label className="block text-sm font-medium mb-2">Review</label><textarea value={content} onChange={(e) => setContent(e.target.value)} rows="4" className="w-full px-4 py-2 border rounded-lg" placeholder="Share your detailed experience..." required /></div>
      <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Submit Review</button>
    </form>
  )
}

export default ReviewForm