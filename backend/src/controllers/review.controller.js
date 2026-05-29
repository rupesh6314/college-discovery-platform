// backend/src/controllers/review.controller.js
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

exports.getCollegeReviews = async (req, res) => {
  try {
    const { collegeId } = req.params
    const reviews = await prisma.review.findMany({
      where: { collegeId },
      include: { user: { select: { name: true, avatar: true } } },
      orderBy: { createdAt: 'desc' }
    })
    res.json({ success: true, reviews })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

exports.createReview = async (req, res) => {
  try {
    const { collegeId } = req.params
    const review = await prisma.review.create({
      data: { ...req.body, userId: req.user.id, collegeId }
    })
    res.status(201).json({ success: true, review })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

exports.updateReview = async (req, res) => {
  try {
    const { id } = req.params
    const review = await prisma.review.update({
      where: { id },
      data: req.body
    })
    res.json({ success: true, review })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

exports.deleteReview = async (req, res) => {
  try {
    const { id } = req.params
    await prisma.review.delete({ where: { id } })
    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

exports.likeReview = async (req, res) => {
  try {
    const { id } = req.params
    await prisma.reviewLike.create({
      data: { userId: req.user.id, reviewId: id }
    })
    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}