// Generate slug from name
const generateSlug = (name) => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

// Format currency
const formatCurrency = (amount) => {
  if (!amount) return 'N/A'
  if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(2)} Cr`
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)} L`
  return `₹${amount.toLocaleString()}`
}

// Calculate percentage
const calculatePercentage = (value, total) => {
  if (!total || total === 0) return 0
  return ((value / total) * 100).toFixed(1)
}

// Validate email
const isValidEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

// Validate phone number (Indian)
const isValidPhone = (phone) => {
  const re = /^[6-9]\d{9}$/
  return re.test(phone)
}

// Pagination helper
const getPagination = (page, limit, total) => {
  const currentPage = parseInt(page) || 1
  const perPage = parseInt(limit) || 10
  const totalPages = Math.ceil(total / perPage)
  const offset = (currentPage - 1) * perPage

  return {
    currentPage,
    perPage,
    totalPages,
    offset,
    hasNext: currentPage < totalPages,
    hasPrev: currentPage > 1
  }
}

// Sleep helper (for async operations)
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))

// Random number between min and max
const randomBetween = (min, max) => Math.floor(Math.random() * (max - min + 1) + min)

module.exports = {
  generateSlug,
  formatCurrency,
  calculatePercentage,
  isValidEmail,
  isValidPhone,
  getPagination,
  sleep,
  randomBetween
}