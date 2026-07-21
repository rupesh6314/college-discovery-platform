const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding Community Q&A and Reviews...')

  // 1. Create a couple of mock users
  const hashedPassword = await bcrypt.hash('student123', 10)
  
  const student1 = await prisma.user.upsert({
    where: { email: 'student1@example.com' },
    update: {},
    create: {
      email: 'student1@example.com',
      password: hashedPassword,
      name: 'Rohan Sharma',
      role: 'STUDENT',
      city: 'Delhi',
      education: 'B.Tech'
    }
  })

  const student2 = await prisma.user.upsert({
    where: { email: 'student2@example.com' },
    update: {},
    create: {
      email: 'student2@example.com',
      password: hashedPassword,
      name: 'Priya Patel',
      role: 'STUDENT',
      city: 'Mumbai',
      education: 'MBA'
    }
  })

  // 2. Get some colleges
  const colleges = await prisma.college.findMany({ take: 3 })
  if (colleges.length === 0) {
    console.log('No colleges found. Run normal seed first.')
    return
  }

  const college1 = colleges[0]
  const college2 = colleges[1]

  // 3. Create Reviews
  await prisma.review.create({
    data: {
      userId: student1.id,
      collegeId: college1.id,
      rating: 5,
      academicRating: 5,
      facultyRating: 4,
      infrastructureRating: 5,
      placementRating: 5,
      campusLifeRating: 4,
      title: 'Amazing experience, great placements',
      content: 'The campus life is vibrant and the placement cell is extremely proactive. Highly recommended!',
      pros: 'Great faculty, 100% placement',
      cons: 'Strict attendance policy',
      isVerified: true,
      helpfulCount: 12
    }
  })

  await prisma.review.create({
    data: {
      userId: student2.id,
      collegeId: college2.id,
      rating: 4,
      academicRating: 4,
      facultyRating: 4,
      infrastructureRating: 4,
      placementRating: 3,
      campusLifeRating: 5,
      title: 'Good academics but placement can improve',
      content: 'I had a wonderful time learning here. The curriculum is very updated, but fewer core companies visit for placement.',
      pros: 'Good curriculum, awesome campus',
      cons: 'Placement for core branches is average',
      isVerified: true,
      helpfulCount: 5
    }
  })

  // 4. Create Questions & Answers
  const question1 = await prisma.question.create({
    data: {
      title: `How is the hostel facility at ${college1.name}?`,
      content: `I am planning to join ${college1.name} next year. Can someone tell me about the hostel rooms, mess food quality, and wifi availability?`,
      userId: student2.id,
      collegeId: college1.id,
      tags: 'Hostel,Facilities',
      upvotes: 4,
      views: 120
    }
  })

  await prisma.answer.create({
    data: {
      content: 'The hostel facilities are pretty good. The rooms are twin-sharing in the first year. Mess food is decent, mostly North Indian cuisine. WiFi is available 24/7 with a 10 Mbps limit.',
      userId: student1.id,
      questionId: question1.id,
      upvotes: 8,
      isAccepted: true
    }
  })

  const question2 = await prisma.question.create({
    data: {
      title: 'Is an education loan easily available?',
      content: 'Does the college have tie-ups with banks to provide fast educational loans?',
      userId: student1.id,
      collegeId: college2.id,
      tags: 'Finance,Loan',
      upvotes: 2,
      views: 45
    }
  })

  await prisma.answer.create({
    data: {
      content: 'Yes, SBI and HDFC have branches inside the campus and they process student loans very quickly if you have your admission letter.',
      userId: student2.id,
      questionId: question2.id,
      upvotes: 3
    }
  })

  console.log('✅ Successfully seeded Reviews, Questions, and Answers!')
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect()
  })
