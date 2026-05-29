import api from './api'

export const communityService = {
  getQuestions: (params) => api.get('/community/questions', { params }).then(res => res.data),
  getQuestionById: (id) => api.get(`/community/questions/${id}`).then(res => res.data),
  createQuestion: (data) => api.post('/community/questions', data).then(res => res.data),
  createAnswer: (questionId, content) => api.post(`/community/questions/${questionId}/answers`, { content }).then(res => res.data),
  vote: (type, id, voteType) => api.post(`/community/${type}/${id}/vote`, { voteType }).then(res => res.data),
  acceptAnswer: (answerId) => api.post(`/community/answers/${answerId}/accept`).then(res => res.data)
}