const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

// Get user statistics for dashboard
exports.getStats = async (req, res) => {
  try {
    const userId = req.user.id

    const [savedCount, comparisonCount, reviewCount, questionCount, answerCount] = await Promise.all([
      prisma.savedCollege.count({ where: { userId } }),
      prisma.comparison.count({ where: { userId } }),
      prisma.review.count({ where: { userId } }),
      prisma.question.count({ where: { userId } }),
      prisma.answer.count({ where: { userId } })
    ])

    // Get recent activity
    const recentActivities = []

    // Get recent saved colleges
    const recentSaved = await prisma.savedCollege.findMany({
      where: { userId },
      include: { college: { select: { name: true, id: true } } },
      orderBy: { savedAt: 'desc' },
      take: 3
    })
    recentSaved.forEach(item => {
      recentActivities.push(`Saved ${item.college.name} to wishlist`)
    })

    // Get recent reviews
    const recentReviews = await prisma.review.findMany({
      where: { userId },
      include: { college: { select: { name: true, id: true } } },
      orderBy: { createdAt: 'desc' },
      take: 3
    })
    recentReviews.forEach(item => {
      recentActivities.push(`Reviewed ${item.college.name} - ${item.rating}/5 stars`)
    })

    // Get recent questions
    const recentQuestions = await prisma.question.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 3
    })
    recentQuestions.forEach(item => {
      recentActivities.push(`Asked: "${item.title.substring(0, 50)}..."`)
    })

    // Get personalized recommendations based on saved colleges
    const savedColleges = await prisma.savedCollege.findMany({
      where: { userId },
      include: { college: true }
    })

    let recommendations = []
    if (savedColleges.length > 0) {
      // Get similar colleges based on city and type
      const savedCities = [...new Set(savedColleges.map(s => s.college.city))]
      const savedTypes = [...new Set(savedColleges.map(s => s.college.type))]

      recommendations = await prisma.college.findMany({
        where: {
          OR: [
            { city: { in: savedCities } },
            { type: { in: savedTypes } }
          ],
          NOT: { id: { in: savedColleges.map(s => s.collegeId) } }
        },
        select: {
          id: true,
          name: true,
          slug: true,
          city: true,
          overallRating: true,
          totalFee: true,
          logoUrl: true
        },
        take: 5
      })
    }

    res.json({
      savedCount,
      comparisonCount,
      reviewCount,
      questionCount,
      answerCount,
      recentActivities: recentActivities.slice(0, 5),
      recommendations
    })
  } catch (error) {
    console.error('Get stats error:', error)
    res.status(500).json({ error: 'Failed to fetch user statistics' })
  }
}

// Get all saved colleges for user
exports.getSavedColleges = async (req, res) => {
  try {
    const savedColleges = await prisma.savedCollege.findMany({
      where: { userId: req.user.id },
      include: {
        college: {
          include: {
            _count: {
              select: { reviews: true }
            }
          }
        }
      },
      orderBy: { savedAt: 'desc' }
    })

    res.json(savedColleges)
  } catch (error) {
    console.error('Get saved colleges error:', error)
    res.status(500).json({ error: 'Failed to fetch saved colleges' })
  }
}

// Save a college
exports.saveCollege = async (req, res) => {
  try {
    const { collegeId } = req.body

    // Check if college exists
    const college = await prisma.college.findUnique({
      where: { id: collegeId }
    })

    if (!college) {
      return res.status(404).json({ error: 'College not found' })
    }

    // Check if already saved
    const existing = await prisma.savedCollege.findUnique({
      where: {
        userId_collegeId: {
          userId: req.user.id,
          collegeId
        }
      }
    })

    if (existing) {
      return res.status(400).json({ error: 'College already saved' })
    }

    const savedCollege = await prisma.savedCollege.create({
      data: {
        userId: req.user.id,
        collegeId
      },
      include: {
        college: true
      }
    })

    res.status(201).json(savedCollege)
  } catch (error) {
    console.error('Save college error:', error)
    res.status(500).json({ error: 'Failed to save college' })
  }
}

// Remove a saved college
exports.removeSavedCollege = async (req, res) => {
  try {
    const { collegeId } = req.params

    await prisma.savedCollege.delete({
      where: {
        userId_collegeId: {
          userId: req.user.id,
          collegeId
        }
      }
    })

    res.json({ success: true, message: 'College removed from saved' })
  } catch (error) {
    console.error('Remove saved college error:', error)
    res.status(500).json({ error: 'Failed to remove saved college' })
  }
}

// Get all saved comparisons for user
exports.getComparisons = async (req, res) => {
  try {
    const comparisons = await prisma.comparison.findMany({
      where: { userId: req.user.id },
      include: {
        colleges: {
          include: {
            college: {
              select: {
                id: true,
                name: true,
                slug: true,
                city: true,
                state: true,
                logoUrl: true,
                overallRating: true
              }
            }
          },
          orderBy: { order: 'asc' }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    res.json(comparisons)
  } catch (error) {
    console.error('Get comparisons error:', error)
    res.status(500).json({ error: 'Failed to fetch comparisons' })
  }
}

// Delete a saved comparison
exports.deleteComparison = async (req, res) => {
  try {
    const { id } = req.params

    const comparison = await prisma.comparison.findFirst({
      where: {
        id,
        userId: req.user.id
      }
    })

    if (!comparison) {
      return res.status(404).json({ error: 'Comparison not found' })
    }

    await prisma.comparison.delete({ where: { id } })

    res.json({ success: true, message: 'Comparison deleted' })
  } catch (error) {
    console.error('Delete comparison error:', error)
    res.status(500).json({ error: 'Failed to delete comparison' })
  }
}

// Update user profile
exports.updateProfile = async (req, res) => {
  try {
    const { name, phone, city, state, education, examScore, examName, interests, budgetMin, budgetMax } = req.body

    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        name: name || undefined,
        phone: phone || undefined,
        city: city || undefined,
        state: state || undefined,
        education: education || undefined,
        examScore: examScore ? parseFloat(examScore) : undefined,
        examName: examName || undefined,
        interests: interests ? JSON.stringify(interests) : undefined,
        budgetMin: budgetMin ? parseFloat(budgetMin) : undefined,
        budgetMax: budgetMax ? parseFloat(budgetMax) : undefined
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        city: true,
        state: true,
        education: true,
        examScore: true,
        examName: true,
        interests: true,
        budgetMin: true,
        budgetMax: true,
        role: true,
        createdAt: true
      }
    })

    res.json({ success: true, user: updatedUser })
  } catch (error) {
    console.error('Update profile error:', error)
    res.status(500).json({ error: 'Failed to update profile' })
  }
}