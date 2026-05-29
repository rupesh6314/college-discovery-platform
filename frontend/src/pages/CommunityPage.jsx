import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from 'react-query'
import { motion } from 'framer-motion'
import { FiMessageCircle, FiTrendingUp, FiClock, FiUser, FiThumbsUp, FiPlus } from 'react-icons/fi'
import { formatDistanceToNow } from 'date-fns'
import { useSelector } from 'react-redux'
import AskQuestion from '../components/community/AskQuestion'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import { communityService } from '../services/community.service'

const CommunityPage = () => {
  const [showAskModal, setShowAskModal] = useState(false)
  const [sortBy, setSortBy] = useState('recent')
  const { isAuthenticated } = useSelector((state) => state.auth)

  const { data, isLoading, refetch } = useQuery(['questions', sortBy], () => communityService.getQuestions({ sort: sortBy, limit: 20 }))

  const getSortIcon = () => {
    if (sortBy === 'recent') return <FiClock />
    if (sortBy === 'votes') return <FiThumbsUp />
    return <FiTrendingUp />
  }

  if (isLoading) return <LoadingSpinner />

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom">
        <div className="flex justify-between items-center mb-6">
          <div><h1 className="text-3xl font-bold">Community Q&A</h1><p className="text-gray-600 mt-1">Get answers from students and alumni</p></div>
          <button onClick={() => isAuthenticated ? setShowAskModal(true) : alert('Please login to ask questions')} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"><FiPlus /> Ask Question</button>
        </div>

        <div className="flex gap-6">
          <div className="flex-1 space-y-4">
            <div className="flex gap-2 border-b pb-2"><button onClick={() => setSortBy('recent')} className={`flex items-center gap-2 px-3 py-1 rounded ${sortBy === 'recent' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}><FiClock /> Recent</button><button onClick={() => setSortBy('votes')} className={`flex items-center gap-2 px-3 py-1 rounded ${sortBy === 'votes' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}><FiThumbsUp /> Most Voted</button><button onClick={() => setSortBy('trending')} className={`flex items-center gap-2 px-3 py-1 rounded ${sortBy === 'trending' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}><FiTrendingUp /> Trending</button></div>

            {data?.questions?.map((question) => (
              <motion.div key={question.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition">
                <Link to={`/community/${question.id}`}><h3 className="text-lg font-semibold hover:text-blue-600 transition mb-2">{question.title}</h3></Link>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{question.content}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-gray-500"><div className="flex items-center gap-1"><FiUser size={14} /> {question.user?.name}</div><div className="flex items-center gap-1"><FiMessageCircle size={14} /> {question._count?.answers || 0} answers</div><div className="flex items-center gap-1"><FiThumbsUp size={14} /> {question.upvotes} votes</div><div>{formatDistanceToNow(new Date(question.createdAt), { addSuffix: true })}</div></div>
                  {question.tags?.length > 0 && <div className="flex gap-1">{question.tags.slice(0, 2).map(tag => <span key={tag} className="px-2 py-0.5 bg-gray-100 rounded-full text-xs">#{tag}</span>)}</div>}
                </div>
              </motion.div>
            ))}
          </div>
          <div className="w-80 hidden lg:block">
            <div className="bg-white rounded-xl p-5 shadow-sm sticky top-24"><h3 className="font-semibold mb-3">Top Contributors</h3><div className="space-y-3">{data?.topContributors?.map(user => (<div key={user.id} className="flex items-center gap-2"><div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white text-sm">{user.name[0]}</div><div><div className="text-sm font-medium">{user.name}</div><div className="text-xs text-gray-500">{user.reputation} reputation</div></div></div>))}</div></div>
          </div>
        </div>

        {showAskModal && <AskQuestion onClose={() => setShowAskModal(false)} onSuccess={() => { refetch(); setShowAskModal(false) }} />}
      </div>
    </div>
  )
}

export default CommunityPage