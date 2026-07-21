require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function updateEmail() {
  try {
    const updatedUser = await prisma.user.update({
      where: { email: 'rupesh2k5chandra@gmail.com' },
      data: { email: 'rupesh.2k5chandra@gmail.com' }
    });
    console.log('Successfully updated email to', updatedUser.email);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}
updateEmail();
