const { PrismaClient } = require('@prisma/client')
const fs = require('fs')
const path = require('path')
const prisma = new PrismaClient()

// Load curated college images
const collegeImages = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'prisma', 'college-images.json'), 'utf8')
)

// Generic placeholder for colleges without custom images
const generatePlaceholder = (collegeName, collegeType) => {
  // Create a beautiful gradient placeholder with SVG
  const encodedName = encodeURIComponent(collegeName)
  const encodedType = encodeURIComponent(collegeType || 'College')
  
  return {
    logoUrl: `https://placehold.co/400x400/2563eb/white?text=${encodedName.charAt(0)}`,
    coverUrl: `https://placehold.co/1200x400/1e40af/white?text=${encodedName.replace(/%20/g, '+')}&fontSize=24`
  }
}

async function updateCollegeImages() {
  console.log('🖼️ Updating college images with curated database...\n')

  let updatedCount = 0
  let placeholderCount = 0

  // Get all colleges
  const allColleges = await prisma.college.findMany()
  console.log(`📚 Found ${allColleges.length} colleges\n`)

  for (const college of allColleges) {
    const imageData = collegeImages[college.slug]
    
    if (imageData) {
      // Update with real curated image
      await prisma.college.update({
        where: { id: college.id },
        data: {
          logoUrl: imageData.logoUrl,
          coverImageUrl: imageData.coverUrl,
          images: imageData.gallery ? JSON.stringify(imageData.gallery) : null
        }
      })
      console.log(`✅ ${college.name} - Updated with real image`)
      updatedCount++
    } else {
      // Use professional placeholder
      const placeholder = generatePlaceholder(college.name, college.type)
      await prisma.college.update({
        where: { id: college.id },
        data: {
          logoUrl: placeholder.logoUrl,
          coverImageUrl: placeholder.coverUrl
        }
      })
      console.log(`🖼️ ${college.name} - Using branded placeholder`)
      placeholderCount++
    }
  }

  console.log(`\n📊 Summary:`)
  console.log(`   ✅ Real images: ${updatedCount} colleges`)
  console.log(`   🖼️ Placeholders: ${placeholderCount} colleges`)
  console.log(`   🎉 Total: ${allColleges.length} colleges updated`)
}

updateCollegeImages()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect()
    console.log('\n✨ Image update complete!')
  })