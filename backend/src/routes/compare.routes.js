const express = require('express')
const router = express.Router()
const { protect } = require('../middleware/auth')

// Import controller (make sure it exists)
let compareController
try {
  compareController = require('../controllers/compare.controller')
} catch (error) {
  console.error('Failed to load compare.controller:', error.message)
  compareController = {
    compareColleges: (req, res) => res.status(500).json({ error: 'Controller not loaded' }),
    saveComparison: (req, res) => res.status(500).json({ error: 'Controller not loaded' }),
    getSavedComparisons: (req, res) => res.status(500).json({ error: 'Controller not loaded' }),
    deleteComparison: (req, res) => res.status(500).json({ error: 'Controller not loaded' })
  }
}

// Public routes
router.post('/', compareController.compareColleges)

// Protected routes (saved comparisons)
router.post('/save', protect, compareController.saveComparison)
router.get('/saved', protect, compareController.getSavedComparisons)
router.delete('/:id', protect, compareController.deleteComparison)

module.exports = router