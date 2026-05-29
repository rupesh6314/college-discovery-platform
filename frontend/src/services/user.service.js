import api from './api'

export const userService = {
  getStats: () => api.get('/user/stats').then(res => res.data),
  getSavedColleges: () => api.get('/user/saved').then(res => res.data),
  removeSavedCollege: (collegeId) => api.delete(`/user/saved/${collegeId}`).then(res => res.data),
  getComparisons: () => api.get('/user/comparisons').then(res => res.data),
  deleteComparison: (id) => api.delete(`/user/comparisons/${id}`).then(res => res.data)
}