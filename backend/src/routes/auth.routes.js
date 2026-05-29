const express = require('express')
const router = express.Router()
const { protect } = require('../middleware/auth')
const { validateRegister, validateLogin, handleValidationErrors } = require('../middleware/validation')
const authController = require('../controllers/auth.controller')

// Public routes
router.post('/register', validateRegister, handleValidationErrors, authController.register)
router.post('/login', validateLogin, handleValidationErrors, authController.login)
router.post('/refresh', authController.refreshToken)
router.post('/forgot-password', authController.forgotPassword)
router.post('/reset-password', authController.resetPassword)

// Protected routes
router.get('/me', protect, authController.getMe)
router.put('/profile', protect, authController.updateProfile)
router.post('/change-password', protect, authController.changePassword)

module.exports = router