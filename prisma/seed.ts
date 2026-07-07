import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
const prisma = new PrismaClient();

async function main() {
  // Create an owner user (password: "password123" for testing)
  const hashedPassword = await bcrypt.hash('password123', 10);
  
  await prisma.user.upsert({
    where: { email: 'owner@backyardbrew.com' },
    update: {},
    create: {
      name: 'Cafe Owner',
      email: 'owner@backyardbrew.com',
      password: hashedPassword,
      role: 'OWNER',
    },
  });

  // Create an admin user too!
  const hashedAdminPassword = await bcrypt.hash('admin123', 10);
  
  await prisma.user.upsert({
    where: { email: 'admin@backyardbrew.com' },
    update: {},
    create: {
      name: 'Cafe Admin',
      email: 'admin@backyardbrew.com',
      password: hashedAdminPassword,
      role: 'ADMIN',
    },
  });

  // Add initial reservations
  await prisma.reservation.createMany({
    data: [
      {
        guestName: 'Aarav Mehta',
        phone: '+91 98765 43211',
        partySize: 3,
        timeSlot: '10:00 AM',
        status: 'CONFIRMED',
        source: 'Website',
      },
      {
        guestName: 'Nisha Rao',
        phone: '+91 98765 43212',
        partySize: 2,
        timeSlot: '11:30 AM',
        status: 'PENDING',
        source: 'WhatsApp',
      },
      {
        guestName: 'Kabir Singh',
        phone: '+91 98765 43213',
        partySize: 5,
        timeSlot: '1:00 PM',
        status: 'CONFIRMED',
        source: 'QR',
      },
    ],
  });

  // Add initial tasks
  await prisma.task.createMany({
    data: [
      { title: 'Confirm pending WhatsApp booking' },
      { title: 'Upload weekend event poster' },
      { title: 'Review low-stock dessert ingredients' },
      { title: 'Send loyalty coupon to regular guests' },
    ],
  });

  console.log('Database seeded successfully!');
  console.log('Owner login: owner@backyardbrew.com / password123');
  console.log('Admin login: admin@backyardbrew.com / admin123');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
