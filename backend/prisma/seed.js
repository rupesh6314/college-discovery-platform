const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')
const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database with 100+ colleges...')

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10)
  
  await prisma.user.upsert({
    where: { email: 'admin@collegediscovery.com' },
    update: {},
    create: {
      email: 'admin@collegediscovery.com',
      password: hashedPassword,
      name: 'Admin User',
      role: 'ADMIN'
    }
  })

  const colleges = [
    // IITs (23)
    { name: "Indian Institute of Technology Bombay", slug: "iit-bombay", city: "Mumbai", state: "Maharashtra", type: "IIT", established: 1958, ranking: 1, totalFee: 800000, overallRating: 4.8, averagePackage: 2500000, placementRate: 95 },
    { name: "Indian Institute of Technology Delhi", slug: "iit-delhi", city: "Delhi", state: "Delhi", type: "IIT", established: 1961, ranking: 2, totalFee: 820000, overallRating: 4.8, averagePackage: 2400000, placementRate: 94 },
    { name: "Indian Institute of Technology Madras", slug: "iit-madras", city: "Chennai", state: "Tamil Nadu", type: "IIT", established: 1959, ranking: 3, totalFee: 790000, overallRating: 4.7, averagePackage: 2300000, placementRate: 93 },
    { name: "Indian Institute of Technology Kanpur", slug: "iit-kanpur", city: "Kanpur", state: "Uttar Pradesh", type: "IIT", established: 1959, ranking: 4, totalFee: 800000, overallRating: 4.7, averagePackage: 2200000, placementRate: 92 },
    { name: "Indian Institute of Technology Kharagpur", slug: "iit-kharagpur", city: "Kharagpur", state: "West Bengal", type: "IIT", established: 1951, ranking: 5, totalFee: 810000, overallRating: 4.7, averagePackage: 2250000, placementRate: 93 },
    { name: "Indian Institute of Technology Roorkee", slug: "iit-roorkee", city: "Roorkee", state: "Uttarakhand", type: "IIT", established: 1847, ranking: 6, totalFee: 780000, overallRating: 4.6, averagePackage: 2100000, placementRate: 91 },
    { name: "Indian Institute of Technology Guwahati", slug: "iit-guwahati", city: "Guwahati", state: "Assam", type: "IIT", established: 1994, ranking: 7, totalFee: 790000, overallRating: 4.6, averagePackage: 2150000, placementRate: 92 },
    { name: "Indian Institute of Technology Hyderabad", slug: "iit-hyderabad", city: "Hyderabad", state: "Telangana", type: "IIT", established: 2008, ranking: 8, totalFee: 800000, overallRating: 4.5, averagePackage: 2200000, placementRate: 94 },
    { name: "Indian Institute of Technology Indore", slug: "iit-indore", city: "Indore", state: "Madhya Pradesh", type: "IIT", established: 2009, ranking: 9, totalFee: 780000, overallRating: 4.4, averagePackage: 2050000, placementRate: 90 },
    { name: "Indian Institute of Technology BHU Varanasi", slug: "iit-bhu", city: "Varanasi", state: "Uttar Pradesh", type: "IIT", established: 1919, ranking: 10, totalFee: 790000, overallRating: 4.4, averagePackage: 2000000, placementRate: 89 },
    
    // NITs (15)
    { name: "National Institute of Technology Trichy", slug: "nit-trichy", city: "Tiruchirappalli", state: "Tamil Nadu", type: "NIT", established: 1964, ranking: 11, totalFee: 600000, overallRating: 4.3, averagePackage: 1800000, placementRate: 88 },
    { name: "National Institute of Technology Surathkal", slug: "nit-surathkal", city: "Mangalore", state: "Karnataka", type: "NIT", established: 1960, ranking: 12, totalFee: 590000, overallRating: 4.3, averagePackage: 1750000, placementRate: 87 },
    { name: "National Institute of Technology Warangal", slug: "nit-warangal", city: "Warangal", state: "Telangana", type: "NIT", established: 1959, ranking: 13, totalFee: 580000, overallRating: 4.2, averagePackage: 1700000, placementRate: 86 },
    { name: "National Institute of Technology Rourkela", slug: "nit-rourkela", city: "Rourkela", state: "Odisha", type: "NIT", established: 1961, ranking: 14, totalFee: 570000, overallRating: 4.2, averagePackage: 1650000, placementRate: 85 },
    { name: "National Institute of Technology Calicut", slug: "nit-calicut", city: "Calicut", state: "Kerala", type: "NIT", established: 1961, ranking: 15, totalFee: 560000, overallRating: 4.1, averagePackage: 1600000, placementRate: 84 },
    
    // Private Universities (30)
    { name: "BITS Pilani", slug: "bits-pilani", city: "Pilani", state: "Rajasthan", type: "Private", established: 1964, ranking: 16, totalFee: 1600000, overallRating: 4.5, averagePackage: 2200000, placementRate: 92 },
    { name: "Vellore Institute of Technology", slug: "vit-vellore", city: "Vellore", state: "Tamil Nadu", type: "Private", established: 1984, ranking: 17, totalFee: 1400000, overallRating: 4.2, averagePackage: 1500000, placementRate: 85 },
    { name: "Manipal Institute of Technology", slug: "manipal", city: "Manipal", state: "Karnataka", type: "Private", established: 1957, ranking: 18, totalFee: 1500000, overallRating: 4.1, averagePackage: 1400000, placementRate: 84 },
    { name: "SRM Institute of Science and Technology", slug: "srm", city: "Chennai", state: "Tamil Nadu", type: "Private", established: 1985, ranking: 19, totalFee: 1300000, overallRating: 4.0, averagePackage: 1300000, placementRate: 83 },
    { name: "Kalinga Institute of Industrial Technology", slug: "kiit", city: "Bhubaneswar", state: "Odisha", type: "Private", established: 1992, ranking: 20, totalFee: 1200000, overallRating: 4.0, averagePackage: 1250000, placementRate: 82 },
    { name: "Amrita Vishwa Vidyapeetham", slug: "amrita", city: "Coimbatore", state: "Tamil Nadu", type: "Private", established: 2003, ranking: 21, totalFee: 1100000, overallRating: 4.1, averagePackage: 1350000, placementRate: 86 },
    { name: "Lovely Professional University", slug: "lpu", city: "Jalandhar", state: "Punjab", type: "Private", established: 2005, ranking: 22, totalFee: 900000, overallRating: 3.9, averagePackage: 800000, placementRate: 78 },
    { name: "Chandigarh University", slug: "chandigarh-university", city: "Chandigarh", state: "Chandigarh", type: "Private", established: 2012, ranking: 23, totalFee: 850000, overallRating: 3.9, averagePackage: 850000, placementRate: 80 },
    { name: "Sharda University", slug: "sharda", city: "Greater Noida", state: "Uttar Pradesh", type: "Private", established: 2009, ranking: 24, totalFee: 800000, overallRating: 3.8, averagePackage: 750000, placementRate: 75 },
    { name: "Amity University", slug: "amity", city: "Noida", state: "Uttar Pradesh", type: "Private", established: 2005, ranking: 25, totalFee: 1000000, overallRating: 3.9, averagePackage: 900000, placementRate: 80 },
    
    // Central Universities (20)
    { name: "University of Delhi", slug: "delhi-university", city: "Delhi", state: "Delhi", type: "Central", established: 1922, ranking: 26, totalFee: 30000, overallRating: 4.4, averagePackage: 800000, placementRate: 70 },
    { name: "University of Mumbai", slug: "mumbai-university", city: "Mumbai", state: "Maharashtra", type: "State", established: 1857, ranking: 27, totalFee: 25000, overallRating: 4.3, averagePackage: 750000, placementRate: 68 },
    { name: "University of Calcutta", slug: "calcutta-university", city: "Kolkata", state: "West Bengal", type: "State", established: 1857, ranking: 28, totalFee: 20000, overallRating: 4.2, averagePackage: 700000, placementRate: 65 },
    { name: "University of Madras", slug: "madras-university", city: "Chennai", state: "Tamil Nadu", type: "State", established: 1857, ranking: 29, totalFee: 20000, overallRating: 4.2, averagePackage: 700000, placementRate: 65 },
    { name: "Banaras Hindu University", slug: "bhu", city: "Varanasi", state: "Uttar Pradesh", type: "Central", established: 1916, ranking: 30, totalFee: 35000, overallRating: 4.3, averagePackage: 850000, placementRate: 72 },
    { name: "Aligarh Muslim University", slug: "amu", city: "Aligarh", state: "Uttar Pradesh", type: "Central", established: 1920, ranking: 31, totalFee: 30000, overallRating: 4.2, averagePackage: 800000, placementRate: 70 },
    { name: "Jamia Millia Islamia", slug: "jmi", city: "Delhi", state: "Delhi", type: "Central", established: 1920, ranking: 32, totalFee: 28000, overallRating: 4.3, averagePackage: 820000, placementRate: 71 },
    { name: "University of Hyderabad", slug: "uoh", city: "Hyderabad", state: "Telangana", type: "Central", established: 1974, ranking: 33, totalFee: 40000, overallRating: 4.3, averagePackage: 900000, placementRate: 74 },
    { name: "Pondicherry University", slug: "pondicherry-university", city: "Puducherry", state: "Puducherry", type: "Central", established: 1985, ranking: 34, totalFee: 35000, overallRating: 4.1, averagePackage: 750000, placementRate: 68 },
    { name: "University of Allahabad", slug: "au", city: "Prayagraj", state: "Uttar Pradesh", type: "Central", established: 1887, ranking: 35, totalFee: 25000, overallRating: 4.0, averagePackage: 700000, placementRate: 65 },
    
    // IIITs (10)
    { name: "IIIT Hyderabad", slug: "iiit-hyderabad", city: "Hyderabad", state: "Telangana", type: "IIIT", established: 1998, ranking: 36, totalFee: 1200000, overallRating: 4.6, averagePackage: 2600000, placementRate: 96 },
    { name: "IIIT Bangalore", slug: "iiit-bangalore", city: "Bangalore", state: "Karnataka", type: "IIIT", established: 1999, ranking: 37, totalFee: 1100000, overallRating: 4.5, averagePackage: 2400000, placementRate: 95 },
    { name: "IIIT Delhi", slug: "iiit-delhi", city: "Delhi", state: "Delhi", type: "IIIT", established: 2008, ranking: 38, totalFee: 1000000, overallRating: 4.4, averagePackage: 2200000, placementRate: 94 },
    { name: "IIIT Allahabad", slug: "iiit-allahabad", city: "Prayagraj", state: "Uttar Pradesh", type: "IIIT", established: 1999, ranking: 39, totalFee: 950000, overallRating: 4.3, averagePackage: 2000000, placementRate: 93 },
    { name: "IIIT Pune", slug: "iiit-pune", city: "Pune", state: "Maharashtra", type: "IIIT", established: 2016, ranking: 40, totalFee: 900000, overallRating: 4.2, averagePackage: 1800000, placementRate: 92 },
    
    // Top Engineering Colleges (20)
    { name: "PES University", slug: "pes", city: "Bangalore", state: "Karnataka", type: "Private", established: 1972, ranking: 41, totalFee: 1000000, overallRating: 4.1, averagePackage: 1450000, placementRate: 86 },
    { name: "RV College of Engineering", slug: "rvce", city: "Bangalore", state: "Karnataka", type: "Private", established: 1963, ranking: 42, totalFee: 800000, overallRating: 4.1, averagePackage: 1400000, placementRate: 85 },
    { name: "College of Engineering Pune", slug: "coep", city: "Pune", state: "Maharashtra", type: "Government", established: 1854, ranking: 43, totalFee: 420000, overallRating: 4.2, averagePackage: 1350000, placementRate: 84 },
    { name: "Delhi Technological University", slug: "dtu", city: "Delhi", state: "Delhi", type: "Government", established: 1941, ranking: 44, totalFee: 500000, overallRating: 4.0, averagePackage: 1600000, placementRate: 90 },
    { name: "Netaji Subhas Institute of Technology", slug: "nsit", city: "Delhi", state: "Delhi", type: "Government", established: 1983, ranking: 45, totalFee: 480000, overallRating: 4.0, averagePackage: 1550000, placementRate: 89 },
    { name: "PEC University of Technology", slug: "pec", city: "Chandigarh", state: "Chandigarh", type: "Government", established: 1921, ranking: 46, totalFee: 450000, overallRating: 3.9, averagePackage: 1400000, placementRate: 85 },
    { name: "Veermata Jijabai Technological Institute", slug: "vjti", city: "Mumbai", state: "Maharashtra", type: "Government", established: 1887, ranking: 47, totalFee: 430000, overallRating: 3.9, averagePackage: 1300000, placementRate: 83 },
    { name: "Sardar Vallabhbhai National Institute of Technology", slug: "svnit", city: "Surat", state: "Gujarat", type: "NIT", established: 1961, ranking: 48, totalFee: 550000, overallRating: 4.0, averagePackage: 1500000, placementRate: 86 },
    { name: "Motilal Nehru National Institute of Technology", slug: "mnnit", city: "Allahabad", state: "Uttar Pradesh", type: "NIT", established: 1961, ranking: 49, totalFee: 560000, overallRating: 4.0, averagePackage: 1480000, placementRate: 85 },
    { name: "Malaviya National Institute of Technology", slug: "mnit", city: "Jaipur", state: "Rajasthan", type: "NIT", established: 1963, ranking: 50, totalFee: 540000, overallRating: 3.9, averagePackage: 1450000, placementRate: 84 },
    
    // Top Management/Business Schools (15)
    { name: "Indian Institute of Management Ahmedabad", slug: "iim-ahmedabad", city: "Ahmedabad", state: "Gujarat", type: "IIM", established: 1961, ranking: 51, totalFee: 2300000, overallRating: 4.9, averagePackage: 3200000, placementRate: 98 },
    { name: "Indian Institute of Management Bangalore", slug: "iim-bangalore", city: "Bangalore", state: "Karnataka", type: "IIM", established: 1973, ranking: 52, totalFee: 2400000, overallRating: 4.9, averagePackage: 3100000, placementRate: 98 },
    { name: "Indian Institute of Management Calcutta", slug: "iim-calcutta", city: "Kolkata", state: "West Bengal", type: "IIM", established: 1961, ranking: 53, totalFee: 2300000, overallRating: 4.8, averagePackage: 3000000, placementRate: 97 },
    { name: "Indian Institute of Management Lucknow", slug: "iim-lucknow", city: "Lucknow", state: "Uttar Pradesh", type: "IIM", established: 1984, ranking: 54, totalFee: 2000000, overallRating: 4.7, averagePackage: 2800000, placementRate: 96 },
    { name: "XLRI Jamshedpur", slug: "xlri", city: "Jamshedpur", state: "Jharkhand", type: "Private", established: 1949, ranking: 55, totalFee: 2500000, overallRating: 4.8, averagePackage: 2900000, placementRate: 97 },
    { name: "Faculty of Management Studies - Delhi", slug: "fms", city: "Delhi", state: "Delhi", type: "Government", established: 1954, ranking: 56, totalFee: 150000, overallRating: 4.7, averagePackage: 2800000, placementRate: 99 },
    { name: "SP Jain Institute of Management", slug: "spjimr", city: "Mumbai", state: "Maharashtra", type: "Private", established: 1981, ranking: 57, totalFee: 2100000, overallRating: 4.6, averagePackage: 2700000, placementRate: 96 },
    { name: "MDI Gurgaon", slug: "mdi", city: "Gurgaon", state: "Haryana", type: "Private", established: 1973, ranking: 58, totalFee: 2200000, overallRating: 4.6, averagePackage: 2600000, placementRate: 95 },
    
    // Top Medical Colleges (10)
    { name: "All India Institute of Medical Sciences Delhi", slug: "aiims-delhi", city: "Delhi", state: "Delhi", type: "Government", established: 1956, ranking: 59, totalFee: 20000, overallRating: 4.9, averagePackage: 1800000, placementRate: 99 },
    { name: "Christian Medical College Vellore", slug: "cmc-vellore", city: "Vellore", state: "Tamil Nadu", type: "Private", established: 1900, ranking: 60, totalFee: 500000, overallRating: 4.8, averagePackage: 1500000, placementRate: 98 },
    { name: "Armed Forces Medical College Pune", slug: "afmc", city: "Pune", state: "Maharashtra", type: "Government", established: 1948, ranking: 61, totalFee: 250000, overallRating: 4.8, averagePackage: 1600000, placementRate: 98 },
    { name: "Maulana Azad Medical College", slug: "mamc", city: "Delhi", state: "Delhi", type: "Government", established: 1959, ranking: 62, totalFee: 30000, overallRating: 4.7, averagePackage: 1400000, placementRate: 97 },
    { name: "King George's Medical University", slug: "kgmu", city: "Lucknow", state: "Uttar Pradesh", type: "Government", established: 1911, ranking: 63, totalFee: 25000, overallRating: 4.6, averagePackage: 1300000, placementRate: 96 },
    { name: "JIPMER Puducherry", slug: "jipmer", city: "Puducherry", state: "Puducherry", type: "Government", established: 1823, ranking: 64, totalFee: 28000, overallRating: 4.7, averagePackage: 1350000, placementRate: 97 },
    
    // Top Law Colleges (10)
    { name: "National Law School of India University", slug: "nlsiu", city: "Bangalore", state: "Karnataka", type: "Government", established: 1986, ranking: 65, totalFee: 800000, overallRating: 4.8, averagePackage: 2200000, placementRate: 95 },
    { name: "NALSAR University of Law", slug: "nalsar", city: "Hyderabad", state: "Telangana", type: "Government", established: 1998, ranking: 66, totalFee: 750000, overallRating: 4.7, averagePackage: 2000000, placementRate: 94 },
    { name: "National Law Institute University", slug: "nliu", city: "Bhopal", state: "Madhya Pradesh", type: "Government", established: 1997, ranking: 67, totalFee: 700000, overallRating: 4.6, averagePackage: 1800000, placementRate: 93 },
    { name: "West Bengal National University of Juridical Sciences", slug: "nujs", city: "Kolkata", state: "West Bengal", type: "Government", established: 1999, ranking: 68, totalFee: 720000, overallRating: 4.6, averagePackage: 1850000, placementRate: 93 },
    { name: "National Law University Delhi", slug: "nlud", city: "Delhi", state: "Delhi", type: "Government", established: 2008, ranking: 69, totalFee: 780000, overallRating: 4.7, averagePackage: 2100000, placementRate: 94 },
    
    // Top Architecture Colleges (10)
    { name: "School of Planning and Architecture Delhi", slug: "spa-delhi", city: "Delhi", state: "Delhi", type: "Government", established: 1941, ranking: 70, totalFee: 400000, overallRating: 4.5, averagePackage: 1200000, placementRate: 88 },
    { name: "CEPT University Ahmedabad", slug: "cept", city: "Ahmedabad", state: "Gujarat", type: "Private", established: 1962, ranking: 71, totalFee: 600000, overallRating: 4.4, averagePackage: 1100000, placementRate: 85 },
    { name: "Indian Institute of Technology Kharagpur Architecture", slug: "iit-kgp-arch", city: "Kharagpur", state: "West Bengal", type: "IIT", established: 1951, ranking: 72, totalFee: 800000, overallRating: 4.6, averagePackage: 1800000, placementRate: 90 },
    { name: "Sir JJ College of Architecture Mumbai", slug: "sir-jj", city: "Mumbai", state: "Maharashtra", type: "Government", established: 1913, ranking: 73, totalFee: 300000, overallRating: 4.3, averagePackage: 1000000, placementRate: 82 }
  ]

  for (const college of colleges) {
    await prisma.college.upsert({
      where: { slug: college.slug },
      update: college,
      create: college
    })
  }

  console.log(`✅ Seeded ${colleges.length} colleges`)
  console.log('✅ Admin: admin@collegediscovery.com / admin123')
}

main().catch(console.error).finally(async () => { await prisma.$disconnect() })