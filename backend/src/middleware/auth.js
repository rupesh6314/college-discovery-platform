const jwt = require('jsonwebtoken')
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const protect = async (req, res, next) => {
  let token

  // Check for token in headers
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1]
  }

  // Also check cookies if needed
  if (!token && req.cookies?.token) {
    token = req.cookies.token
  }

  if (!token) {
    return res.status(401).json({ 
      success: false,
      error: 'Not authorized, no token provided',
      message: 'Please login to continue'
    })
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    
    // Get user from database
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        avatar: true
      }
    })

    if (!user) {
      return res.status(401).json({ 
        success: false,
        error: 'User not found',
        message: 'Your account no longer exists'
      })
    }

    req.user = user
    next()
  } catch (error) {
    console.error('Auth error:', error.message)
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        success: false,
        error: 'Invalid token',
        message: 'Your session is invalid, please login again'
      })
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false,
        error: 'Token expired',
        message: 'Your session has expired, please login again'
      })
    }
    
    return res.status(401).json({ 
      success: false,
      error: 'Not authorized',
      message: 'Authentication failed'
    })
  }
}

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false,
        error: `Role ${req.user.role} is not authorized to access this route`,
        message: 'You do not have permission to perform this action'
      })
    }
    next()
  }
}

module.exports = { protect, authorize }