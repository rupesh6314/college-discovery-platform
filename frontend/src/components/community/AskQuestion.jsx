// src/components/community/AskQuestion.jsx - ADD THIS
import React, { useState } from 'react'
import { useMutation, useQueryClient } from 'react-query'
import { motion } from 'framer-motion'
import { FiX } from 'react-icons/fi'
import toast from 'react-hot-toast'
import { communityService } from '../../services/community.service'

const AskQuestion = ({ onClose, onSuccess }) => {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [tags, setTags] = useState('')
  const [collegeId, setCollegeId] = useState('')
  const queryClient = useQueryClient()

  const mutation = useMutation(() => communityService.createQuestion({ title, content, tags: tags.split(',').map(t => t.trim()), collegeId: collegeId || undefined }), {
    onSuccess: () => { queryClient.invalidateQueries('questions'); toast.success('Question posted!'); onSuccess(); onClose() },
    onError: () => toast.error('Failed to post question')
  })

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="relative bg-white rounded-xl w-full max-w-2xl p-6">
        <button onClick={onClose} className="absolute top-4 right-4 p-1 hover:bg-gray-100 rounded"><FiX size={20} /></button>
        <h2 className="text-xl font-bold mb-4">Ask a Question</h2>
        <div className="space-y-4">
          <div><label className="block text-sm font-medium mb-1">Title</label><input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-4 py-2 border rounded-lg" placeholder="What would you like to know?" /></div>
          <div><label className="block text-sm font-medium mb-1">Details</label><textarea value={content} onChange={(e) => setContent(e.target.value)} rows="5" className="w-full px-4 py-2 border rounded-lg" placeholder="Provide more details about your question..." /></div>
          <div><label className="block text-sm font-medium mb-1">Tags (comma separated)</label><input type="text" value={tags} onChange={(e) => setTags(e.target.value)} className="w-full px-4 py-2 border rounded-lg" placeholder="admissions, placements, fees" /></div>
          <button onClick={() => mutation.mutate()} disabled={!title || !content} className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">Post Question</button>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default AskQuestion