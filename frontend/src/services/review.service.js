import api from './api'

export const reviewService = {
  getReviews: (collegeId, params) => api.get(`/reviews/college/${collegeId}`, { params }).then(res => res.data),
  createReview: (collegeId, data) => api.post(`/reviews/college/${collegeId}`, data).then(res => res.data),
  updateReview: (id, data) => api.put(`/reviews/${id}`, data).then(res => res.data),
  deleteReview: (id) => api.delete(`/reviews/${id}`).then(res => res.data),
  likeReview: (id) => api.post(`/reviews/${id}/like`).then(res => res.data)
}