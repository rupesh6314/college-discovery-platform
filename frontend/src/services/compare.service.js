import api from './api'

export const compareService = {
  compareColleges: (collegeIds) => api.post('/compare', { collegeIds }).then(res => res.data),
  saveComparison: (data) => api.post('/compare/save', data).then(res => res.data),
  getSavedComparisons: () => api.get('/compare/saved').then(res => res.data),
  deleteComparison: (id) => api.delete(`/compare/${id}`).then(res => res.data)
}