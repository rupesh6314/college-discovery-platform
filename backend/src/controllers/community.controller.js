const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

// Get all questions
exports.getQuestions = async (req, res) => {
  try {
    const { sort = 'recent', limit = 20, page = 1 } = req.query
    
    let orderBy = {}
    if (sort === 'recent') orderBy = { createdAt: 'desc' }
    if (sort === 'votes') orderBy = { upvotes: 'desc' }
    
    const questions = await prisma.question.findMany({
      take: parseInt(limit),
      skip: (parseInt(page) - 1) * parseInt(limit),
      orderBy,
      include: {
        user: { select: { id: true, name: true, avatar: true } },
        _count: { select: { answers: true } }
      }
    })
    
    const total = await prisma.question.count()
    
    res.json({
      success: true,
      questions,
      topContributors: [],
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    })
  } catch (error) {
    console.error('Get questions error:', error)
    res.json({ success: true, questions: [], topContributors: [] })
  }
}

// Get single question by ID
exports.getQuestionById = async (req, res) => {
  try {
    const { id } = req.params
    
    const question = await prisma.question.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, name: true, avatar: true } },
        answers: {
          include: {
            user: { select: { id: true, name: true, avatar: true } }
          },
          orderBy: { createdAt: 'desc' }
        }
      }
    })
    
    if (!question) {
      return res.status(404).json({ error: 'Question not found' })
    }
    
    res.json({
      success: true,
      question,
      answers: question.answers
    })
  } catch (error) {
    console.error('Get question by id error:', error)
    res.status(500).json({ error: error.message })
  }
}

// Create a new question
exports.createQuestion = async (req, res) => {
  try {
    const { title, content, tags, collegeId } = req.body
    
    const question = await prisma.question.create({
      data: {
        title,
        content,
        tags: tags || null,
        collegeId: collegeId || null,
        userId: req.user.id
      },
      include: {
        user: { select: { id: true, name: true, avatar: true } }
      }
    })
    
    res.status(201).json({ success: true, question })
  } catch (error) {
    console.error('Create question error:', error)
    res.status(500).json({ error: error.message })
  }
}

// Create an answer
exports.createAnswer = async (req, res) => {
  try {
    const { id } = req.params
    const { content } = req.body
    
    const answer = await prisma.answer.create({
      data: {
        content,
        userId: req.user.id,
        questionId: id
      },
      include: {
        user: { select: { id: true, name: true, avatar: true } }
      }
    })
    
    res.status(201).json({ success: true, answer })
  } catch (error) {
    console.error('Create answer error:', error)
    res.status(500).json({ error: error.message })
  }
}

// Vote on question or answer
exports.vote = async (req, res) => {
  try {
    const { type, id } = req.params
    const { voteType } = req.body
    
    if (type === 'question') {
      await prisma.question.update({
        where: { id },
        data: { upvotes: { increment: voteType } }
      })
    } else if (type === 'answer') {
      await prisma.answer.update({
        where: { id },
        data: { upvotes: { increment: voteType } }
      })
    }
    
    res.json({ success: true })
  } catch (error) {
    console.error('Vote error:', error)
    res.status(500).json({ error: error.message })
  }
}

// Accept an answer
exports.acceptAnswer = async (req, res) => {
  try {
    const { id } = req.params
    
    const answer = await prisma.answer.findUnique({
      where: { id },
      include: { question: true }
    })
    
    if (!answer) {
      return res.status(404).json({ error: 'Answer not found' })
    }
    
    await prisma.answer.update({
      where: { id },
      data: { isAccepted: true }
    })
    
    await prisma.question.update({
      where: { id: answer.questionId },
      data: { isResolved: true, acceptedAnswerId: id }
    })
    
    res.json({ success: true })
  } catch (error) {
    console.error('Accept answer error:', error)
    res.status(500).json({ error: error.message })
  }
}