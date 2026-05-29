const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

// Get all colleges
exports.getAllColleges = async (req, res) => {
  try {
    const { page = 1, limit = 20, search } = req.query
    const skip = (parseInt(page) - 1) * parseInt(limit)
    const take = parseInt(limit)

    const where = {}
    if (search && search.trim()) {
      where.name = { contains: search }
    }

    const [colleges, total] = await Promise.all([
      prisma.college.findMany({ where, skip, take, orderBy: { overallRating: 'desc' } }),
      prisma.college.count({ where })
    ])

    res.json({
      success: true,
      data: colleges,
      pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / take) }
    })
  } catch (error) {
    console.error('Get colleges error:', error)
    res.status(500).json({ error: error.message })
  }
}

// Get college by ID
exports.getCollegeById = async (req, res) => {
  try {
    const college = await prisma.college.findUnique({ where: { id: req.params.id } })
    if (!college) return res.status(404).json({ error: 'College not found' })
    res.json({ success: true, data: college })
  } catch (error) {
    console.error('Get college by id error:', error)
    res.status(500).json({ error: error.message })
  }
}

// Get top colleges
exports.getTopColleges = async (req, res) => {
  try {
    const colleges = await prisma.college.findMany({ take: 10, orderBy: { overallRating: 'desc' } })
    res.json({ success: true, data: colleges })
  } catch (error) {
    console.error('Get top colleges error:', error)
    res.status(500).json({ error: error.message })
  }
}

// Get colleges by location
exports.getCollegesByLocation = async (req, res) => {
  try {
    const { state, city } = req.query
    const where = {}
    if (state) where.state = state
    if (city) where.city = city
    const colleges = await prisma.college.findMany({ where })
    res.json({ success: true, data: colleges })
  } catch (error) {
    console.error('Get colleges by location error:', error)
    res.status(500).json({ error: error.message })
  }
}

// Autocomplete
exports.autocomplete = async (req, res) => {
  try {
    const { q } = req.query
    if (!q || q.length < 2) return res.json({ success: true, data: [] })
    const colleges = await prisma.college.findMany({
      where: { name: { contains: q } },
      take: 10,
      select: { id: true, name: true, slug: true, city: true, logoUrl: true }
    })
    res.json({ success: true, data: colleges })
  } catch (error) {
    console.error('Autocomplete error:', error)
    res.json({ success: true, data: [] })
  }
}

// Filter colleges
exports.filterColleges = async (req, res) => {
  try {
    const filters = req.body
    const where = {}
    if (filters.city) where.city = filters.city
    if (filters.state) where.state = filters.state
    if (filters.type) where.type = filters.type
    if (filters.minRating) where.overallRating = { gte: parseFloat(filters.minRating) }
    if (filters.maxFee) where.totalFee = { lte: parseFloat(filters.maxFee) }
    const colleges = await prisma.college.findMany({ where })
    res.json({ success: true, data: colleges })
  } catch (error) {
    console.error('Filter colleges error:', error)
    res.status(500).json({ error: error.message })
  }
}

// Create college (Admin)
exports.createCollege = async (req, res) => {
  try {
    const college = await prisma.college.create({ data: req.body })
    res.status(201).json({ success: true, college })
  } catch (error) {
    console.error('Create college error:', error)
    res.status(500).json({ error: error.message })
  }
}

// Update college (Admin)
exports.updateCollege = async (req, res) => {
  try {
    const college = await prisma.college.update({ where: { id: req.params.id }, data: req.body })
    res.json({ success: true, college })
  } catch (error) {
    console.error('Update college error:', error)
    res.status(500).json({ error: error.message })
  }
}

// Delete college (Admin)
exports.deleteCollege = async (req, res) => {
  try {
    await prisma.college.delete({ where: { id: req.params.id } })
    res.json({ success: true })
  } catch (error) {
    console.error('Delete college error:', error)
    res.status(500).json({ error: error.message })
  }
}