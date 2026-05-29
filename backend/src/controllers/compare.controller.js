const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

// Compare multiple colleges (unlimited)
const compareColleges = async (req, res) => {
  try {
    const { collegeIds } = req.body

    if (!collegeIds || collegeIds.length < 2) {
      return res.status(400).json({ error: 'At least 2 colleges are required for comparison' })
    }

    if (collegeIds.length > 20) {
      return res.status(400).json({ error: 'Maximum 20 colleges can be compared at once' })
    }

    const colleges = await prisma.college.findMany({
      where: { id: { in: collegeIds } },
      include: {
        _count: {
          select: { reviews: true, savedBy: true }
        }
      }
    })

    if (colleges.length === 0) {
      return res.status(404).json({ error: 'No colleges found' })
    }

    // Parse JSON fields
    const parsedColleges = colleges.map(college => ({
      ...college,
      topRecruiters: college.topRecruiters ? JSON.parse(college.topRecruiters) : [],
      examsAccepted: college.examsAccepted ? JSON.parse(college.examsAccepted) : []
    }))

    res.json({
      success: true,
      count: parsedColleges.length,
      colleges: parsedColleges,
      comparisonMatrix: generateComparisonMatrix(parsedColleges),
      insights: generateInsights(parsedColleges),
      rankings: generateRankings(parsedColleges)
    })
  } catch (error) {
    console.error('Compare colleges error:', error)
    res.status(500).json({ error: 'Failed to compare colleges: ' + error.message })
  }
}

// Save a comparison
const saveComparison = async (req, res) => {
  try {
    const { name, collegeIds } = req.body

    if (!collegeIds || collegeIds.length === 0) {
      return res.status(400).json({ error: 'No colleges to save' })
    }

    const comparison = await prisma.comparison.create({
      data: {
        name: name || `Comparison ${new Date().toLocaleDateString()}`,
        userId: req.user.id,
        colleges: {
          create: collegeIds.map((collegeId, index) => ({
            collegeId,
            order: index
          }))
        }
      }
    })

    res.status(201).json({ success: true, comparison })
  } catch (error) {
    console.error('Save comparison error:', error)
    res.status(500).json({ error: 'Failed to save comparison: ' + error.message })
  }
}

// Get saved comparisons
const getSavedComparisons = async (req, res) => {
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
                overallRating: true,
                totalFee: true
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
    console.error('Get saved comparisons error:', error)
    res.status(500).json({ error: 'Failed to fetch saved comparisons: ' + error.message })
  }
}

// Delete saved comparison
const deleteComparison = async (req, res) => {
  try {
    const { id } = req.params

    const comparison = await prisma.comparison.findFirst({
      where: { id, userId: req.user.id }
    })

    if (!comparison) {
      return res.status(404).json({ error: 'Comparison not found' })
    }

    await prisma.comparison.delete({ where: { id } })

    res.json({ success: true, message: 'Comparison deleted' })
  } catch (error) {
    console.error('Delete comparison error:', error)
    res.status(500).json({ error: 'Failed to delete comparison: ' + error.message })
  }
}

// Helper functions
function generateComparisonMatrix(colleges) {
  const matrix = {
    basicInfo: {
      label: "Basic Information",
      parameters: {
        name: { label: "College Name", type: "text", values: colleges.map(c => c.name) },
        city: { label: "City", type: "text", values: colleges.map(c => c.city) },
        state: { label: "State", type: "text", values: colleges.map(c => c.state) },
        established: { label: "Established", type: "number", values: colleges.map(c => c.established || "N/A") },
        type: { label: "Type", type: "text", values: colleges.map(c => c.type || "N/A") }
      }
    },
    fees: {
      label: "Fee Structure",
      parameters: {
        totalFee: { label: "Total Fee", type: "currency", values: colleges.map(c => c.totalFee) }
      }
    },
    ratings: {
      label: "Ratings",
      parameters: {
        overallRating: { label: "Overall Rating", type: "rating", values: colleges.map(c => c.overallRating || 0) }
      }
    },
    placements: {
      label: "Placements",
      parameters: {
        averagePackage: { label: "Average Package", type: "currency", values: colleges.map(c => c.averagePackage) },
        placementRate: { label: "Placement Rate", type: "percentage", values: colleges.map(c => c.placementRate) }
      }
    }
  }
  return matrix
}

function generateInsights(colleges) {
  return {
    summary: `Compare ${colleges.length} colleges to find your best fit.`,
    recommendations: [`Consider your budget and career goals when choosing.`]
  }
}

function generateRankings(colleges) {
  const byRating = [...colleges].sort((a, b) => (b.overallRating || 0) - (a.overallRating || 0))
  const byPackage = [...colleges].sort((a, b) => (b.averagePackage || 0) - (a.averagePackage || 0))
  const byFee = [...colleges].sort((a, b) => (a.totalFee || Infinity) - (b.totalFee || Infinity))

  return {
    overall: byRating.map((c, i) => ({ rank: i + 1, name: c.name, score: c.overallRating })),
    placement: byPackage.map((c, i) => ({ rank: i + 1, name: c.name, package: c.averagePackage })),
    affordability: byFee.map((c, i) => ({ rank: i + 1, name: c.name, fee: c.totalFee }))
  }
}

// Export all functions
module.exports = {
  compareColleges,
  saveComparison,
  getSavedComparisons,
  deleteComparison
}