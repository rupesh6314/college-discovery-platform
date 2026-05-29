import api from './api'

export const collegeService = {
  getAllColleges: (params) => api.get('/colleges', { params }).then(res => res.data),
  getCollegeById: (id) => api.get(`/colleges/${id}`).then(res => res.data),
  filterColleges: (filters) => api.post('/colleges/filter', filters).then(res => res.data),
  getTopColleges: (category, limit) => api.get('/colleges/top', { params: { category, limit } }).then(res => res.data),
  getCollegesByLocation: (state, city) => api.get('/colleges/location', { params: { state, city } }).then(res => res.data),
  autocomplete: (query) => api.get('/colleges/autocomplete', { params: { q: query } }).then(res => res.data),
  saveCollege: (collegeId) => api.post('/user/saved', { collegeId }).then(res => res.data),
  unsaveCollege: (collegeId) => api.delete(`/user/saved/${collegeId}`).then(res => res.data)
}