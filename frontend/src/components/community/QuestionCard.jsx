// src/components/community/QuestionCard.jsx - ADD THIS
import React from 'react'
import { Link } from 'react-router-dom'
import { formatDistanceToNow } from 'date-fns'
import { FiMessageCircle, FiThumbsUp, FiUser, FiClock } from 'react-icons/fi'

const QuestionCard = ({ question }) => {
  return (
    <div className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition">
      <Link to={`/community/${question.id}`}><h3 className="text-lg font-semibold hover:text-blue-600 transition mb-2">{question.title}</h3></Link>
      <p className="text-gray-600 text-sm mb-3 line-clamp-2">{question.content}</p>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-1"><FiUser size={14} /> {question.user?.name}</div>
          <div className="flex items-center gap-1"><FiMessageCircle size={14} /> {question._count?.answers || 0} answers</div>
          <div className="flex items-center gap-1"><FiThumbsUp size={14} /> {question.upvotes} votes</div>
          <div className="flex items-center gap-1"><FiClock size={14} /> {formatDistanceToNow(new Date(question.createdAt), { addSuffix: true })}</div>
        </div>
        {question.tags?.length > 0 && <div className="flex gap-1">{question.tags.slice(0, 2).map(tag => <span key={tag} className="px-2 py-0.5 bg-gray-100 rounded-full text-xs">#{tag}</span>)}</div>}
      </div>
    </div>
  )
}

export default QuestionCard