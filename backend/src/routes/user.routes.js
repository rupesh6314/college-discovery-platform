const express = require('express')
const router = express.Router()
const { protect } = require('../middleware/auth')

// Import controller with error handling
let userController
try {
  userController = require('../controllers/user.controller')
} catch (error) {
  console.error('Failed to load user.controller:', error.message)
  userController = {
    getStats: (req, res) => res.status(500).json({ error: 'Controller not loaded' }),
    getSavedColleges: (req, res) => res.status(500).json({ error: 'Controller not loaded' }),
    saveCollege: (req, res) => res.status(500).json({ error: 'Controller not loaded' }),
    removeSavedCollege: (req, res) => res.status(500).json({ error: 'Controller not loaded' }),
    getComparisons: (req, res) => res.status(500).json({ error: 'Controller not loaded' }),
    deleteComparison: (req, res) => res.status(500).json({ error: 'Controller not loaded' }),
    updateProfile: (req, res) => res.status(500).json({ error: 'Controller not loaded' })
  }
}

// All routes require authentication
router.use(protect)

router.get('/stats', userController.getStats)
router.get('/saved', userController.getSavedColleges)
router.post('/saved', userController.saveCollege)
router.delete('/saved/:collegeId', userController.removeSavedCollege)
router.get('/comparisons', userController.getComparisons)
router.delete('/comparisons/:id', userController.deleteComparison)
router.put('/profile', userController.updateProfile)

module.exports = router