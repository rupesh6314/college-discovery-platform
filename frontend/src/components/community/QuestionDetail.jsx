import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { useSelector } from 'react-redux'
import { formatDistanceToNow } from 'date-fns'
import { FiThumbsUp, FiCheck, FiUser, FiClock, FiArrowLeft } from 'react-icons/fi'
import toast from 'react-hot-toast'
import { communityService } from '../../services/community.service'
import LoadingSpinner from '../ui/LoadingSpinner'

const QuestionDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { isAuthenticated, user } = useSelector((state) => state.auth)
  const [answerContent, setAnswerContent] = useState('')

  const { data, isLoading } = useQuery(['question', id], () => communityService.getQuestionById(id))

  const answerMutation = useMutation(() => communityService.createAnswer(id, answerContent), {
    onSuccess: () => {
      queryClient.invalidateQueries(['question', id])
      setAnswerContent('')
      toast.success('Answer posted!')
    },
    onError: () => toast.error('Failed to post answer')
  })

  const voteMutation = useMutation(({ type, targetId }) => communityService.vote(type, targetId, 1), {
    onSuccess: () => queryClient.invalidateQueries(['question', id])
  })

  const acceptMutation = useMutation((answerId) => communityService.acceptAnswer(answerId), {
    onSuccess: () => {
      queryClient.invalidateQueries(['question', id])
      toast.success('Answer accepted!')
    }
  })

  if (isLoading) return <LoadingSpinner />
  if (!data?.question) return <div className="text-center py-12">Question not found</div>

  const { question, answers } = data

  return (
    <div className="max-w-4xl mx-auto">
      <button onClick={() => navigate('/community')} className="flex items-center gap-2 text-gray-600 hover:text-blue-600 mb-4"><FiArrowLeft /> Back to Community</button>

      <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
        <h1 className="text-2xl font-bold mb-3">{question.title}</h1>
        <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
          <div className="flex items-center gap-1"><FiUser size={14} /> {question.user?.name}</div>
          <div className="flex items-center gap-1"><FiClock size={14} /> {formatDistanceToNow(new Date(question.createdAt), { addSuffix: true })}</div>
        </div>
        <div className="text-gray-700 whitespace-pre-wrap">{question.content}</div>
        {question.tags?.length > 0 && <div className="flex gap-2 mt-4">{question.tags.map(tag => <span key={tag} className="px-2 py-1 bg-gray-100 rounded-full text-xs">#{tag}</span>)}</div>}
        <button onClick={() => voteMutation.mutate({ type: 'question', targetId: question.id })} className="flex items-center gap-1 mt-4 text-gray-600 hover:text-green-600"><FiThumbsUp /> {question.upvotes || 0}</button>
      </div>

      <h3 className="text-xl font-bold mb-4">{answers?.length || 0} Answers</h3>
      <div className="space-y-4">
        {answers?.map((answer) => (
          <div key={answer.id} className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0"><div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white">{answer.user?.name?.[0]}</div></div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2"><span className="font-medium">{answer.user?.name}</span><span className="text-xs text-gray-500">{formatDistanceToNow(new Date(answer.createdAt), { addSuffix: true })}</span>{answer.isAccepted && <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs flex items-center gap-1"><FiCheck size={12} /> Accepted</span>}</div>
                <div className="text-gray-700 mb-3">{answer.content}</div>
                <button onClick={() => voteMutation.mutate({ type: 'answer', targetId: answer.id })} className="flex items-center gap-1 text-gray-600 hover:text-green-600"><FiThumbsUp /> {answer.upvotes || 0}</button>
                {isAuthenticated && user?.id === question.userId && !answer.isAccepted && <button onClick={() => acceptMutation.mutate(answer.id)} className="ml-4 text-green-600 hover:text-green-700">Accept Answer</button>}
              </div>
            </div>
          </div>
        ))}
      </div>

      {isAuthenticated ? (
        <div className="bg-white rounded-xl p-6 shadow-sm mt-6">
          <h3 className="font-semibold mb-3">Your Answer</h3>
          <textarea value={answerContent} onChange={(e) => setAnswerContent(e.target.value)} rows="4" className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="Write your answer here..." />
          <button onClick={() => answerMutation.mutate()} disabled={!answerContent.trim()} className="mt-3 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">Post Answer</button>
        </div>
      ) : (
        <div className="bg-gray-100 rounded-xl p-6 text-center mt-6"><p className="text-gray-600">Please <a href="/auth/login" className="text-blue-600">login</a> to post an answer</p></div>
      )}
    </div>
  )
}

export default QuestionDetail