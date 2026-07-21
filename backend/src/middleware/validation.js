const { body, validationResult } = require('express-validator')

// Register validation
const validateRegister = [
  body('name')
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),
  body('email')
    .isEmail().withMessage('Please provide a valid email')
    .normalizeEmail({ gmail_remove_dots: false }),
  body('password')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
    .matches(/^(?=.*[A-Za-z])(?=.*\d)/).withMessage('Password must contain at least one letter and one number')
]

// Login validation
const validateLogin = [
  body('email')
    .isEmail().withMessage('Please provide a valid email')
    .normalizeEmail({ gmail_remove_dots: false }),
  body('password')
    .notEmpty().withMessage('Password is required')
]

// College validation
const validateCollege = [
  body('name')
    .notEmpty().withMessage('College name is required'),
  body('city')
    .notEmpty().withMessage('City is required'),
  body('state')
    .notEmpty().withMessage('State is required')
]

// Review validation
const validateReview = [
  body('rating')
    .isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('title')
    .notEmpty().withMessage('Title is required')
    .isLength({ max: 200 }).withMessage('Title too long'),
  body('content')
    .notEmpty().withMessage('Review content is required')
    .isLength({ min: 10, max: 5000 }).withMessage('Review must be between 10 and 5000 characters')
]

// Question validation
const validateQuestion = [
  body('title')
    .notEmpty().withMessage('Title is required')
    .isLength({ min: 10, max: 200 }).withMessage('Title must be between 10 and 200 characters'),
  body('content')
    .notEmpty().withMessage('Content is required')
    .isLength({ min: 20 }).withMessage('Content must be at least 20 characters')
]

// Handle validation results
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array().map(err => ({
        field: err.param,
        message: err.msg
      }))
    })
  }
  next()
}

module.exports = {
  validateRegister,
  validateLogin,
  validateCollege,
  validateReview,
  validateQuestion,
  handleValidationErrors
}