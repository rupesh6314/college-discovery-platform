const express = require('express')
const router = express.Router()
const { protect, authorize } = require('../middleware/auth')
const collegeController = require('../controllers/college.controller')

// Public routes - make sure all functions exist
router.get('/', collegeController.getAllColleges)
router.get('/top', collegeController.getTopColleges || ((req, res) => res.json({ data: [] })))
router.get('/location', collegeController.getCollegesByLocation || ((req, res) => res.json({ data: [] })))
router.get('/autocomplete', collegeController.autocomplete || ((req, res) => res.json({ data: [] })))
router.post('/filter', collegeController.filterColleges || ((req, res) => res.json({ data: [] })))
router.get('/:id', collegeController.getCollegeById)

// Admin only routes
router.post('/', protect, authorize('ADMIN'), collegeController.createCollege || ((req, res) => res.status(501).json({ error: 'Not implemented' })))
router.put('/:id', protect, authorize('ADMIN'), collegeController.updateCollege || ((req, res) => res.status(501).json({ error: 'Not implemented' })))
router.delete('/:id', protect, authorize('ADMIN'), collegeController.deleteCollege || ((req, res) => res.status(501).json({ error: 'Not implemented' })))

module.exports = router