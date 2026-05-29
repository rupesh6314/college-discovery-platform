const express = require('express')
const router = express.Router()
const { protect } = require('../middleware/auth')

// Import controller with error handling
let reviewController
try {
  reviewController = require('../controllers/review.controller')
} catch (error) {
  console.error('Failed to load review.controller:', error.message)
  reviewController = {
    getCollegeReviews: (req, res) => res.status(500).json({ error: 'Controller not loaded' }),
    createReview: (req, res) => res.status(500).json({ error: 'Controller not loaded' }),
    updateReview: (req, res) => res.status(500).json({ error: 'Controller not loaded' }),
    deleteReview: (req, res) => res.status(500).json({ error: 'Controller not loaded' }),
    likeReview: (req, res) => res.status(500).json({ error: 'Controller not loaded' })
  }
}

// Public routes
router.get('/college/:collegeId', reviewController.getCollegeReviews)

// Protected routes
router.post('/college/:collegeId', protect, reviewController.createReview)
router.put('/:id', protect, reviewController.updateReview)
router.delete('/:id', protect, reviewController.deleteReview)
router.post('/:id/like', protect, reviewController.likeReview)

module.exports = router