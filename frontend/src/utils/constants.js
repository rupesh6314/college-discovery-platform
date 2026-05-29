// src/utils/constants.js
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export const COLLEGE_TYPES = ['GOVERNMENT', 'PRIVATE', 'DEEMED', 'CENTRAL', 'STATE']

export const SORT_OPTIONS = [{ value: 'overallRating', label: 'Rating' }, { value: 'totalFee', label: 'Fee (Low to High)' }, { value: 'averagePackage', label: 'Average Package' }, { value: 'ranking', label: 'Ranking' }, { value: 'name', label: 'Name' }]

export const RATING_FILTERS = [{ value: '4.5', label: '4.5+' }, { value: '4.0', label: '4.0+' }, { value: '3.5', label: '3.5+' }, { value: '3.0', label: '3.0+' }]

export const FEE_RANGES = [{ value: '500000', label: 'Under ₹5L' }, { value: '1000000', label: 'Under ₹10L' }, { value: '1500000', label: 'Under ₹15L' }, { value: '2000000', label: 'Under ₹20L' }]