const express = require('express')
const router = express.Router()
const { protect } = require('../middleware/auth')
const communityController = require('../controllers/community.controller')

// Public routes
router.get('/questions', communityController.getQuestions)
router.get('/questions/:id', communityController.getQuestionById)

// Protected routes
router.post('/questions', protect, communityController.createQuestion)
router.post('/questions/:id/answers', protect, communityController.createAnswer)
router.post('/:type/:id/vote', protect, communityController.vote)
router.post('/answers/:id/accept', protect, communityController.acceptAnswer)

module.exports = router